"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import {
  useTransactions,
  type Transaction,
  type CreateTransactionData,
  type TransactionEntry,
} from "@/hooks/useTransactions"
import { useAccounts } from "@/hooks/useAccounts"
import { toast } from "sonner"

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransactionStatus,
    deleteTransaction,
    fetchCategories,
  } = useTransactions()
  const { accounts } = useAccounts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [formData, setFormData] = useState<CreateTransactionData>({
    description: "",
    category: "",
    entries: [
      { accountCode: "", accountName: "", debit: 0, credit: 0 },
      { accountCode: "", accountName: "", debit: 0, credit: 0 },
    ],
  })

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories()
      setCategories(cats)
    }
    loadCategories()
  }, [fetchCategories])

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate entries
    const validEntries = formData.entries.filter((entry) => entry.accountCode && (entry.debit > 0 || entry.credit > 0))

    if (validEntries.length < 2) {
      toast.error("At least two entries are required")
      return
    }

    const totalDebits = validEntries.reduce((sum, entry) => sum + entry.debit, 0)
    const totalCredits = validEntries.reduce((sum, entry) => sum + entry.credit, 0)

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      toast.error("Transaction must be balanced. Debits must equal credits.")
      return
    }

    const success = await createTransaction({
      ...formData,
      entries: validEntries,
    })

    if (success) {
      setIsCreateDialogOpen(false)
      setFormData({
        description: "",
        category: "",
        entries: [
          { accountCode: "", accountName: "", debit: 0, credit: 0 },
          { accountCode: "", accountName: "", debit: 0, credit: 0 },
        ],
      })
    }
  }

  const handleStatusUpdate = async (transaction: Transaction, newStatus: "Draft" | "Posted" | "Cancelled") => {
    const success = await updateTransactionStatus(transaction._id, newStatus)
    if (success) {
      toast.success(`Transaction ${newStatus.toLowerCase()} successfully`)
    }
  }

  const handleDeleteTransaction = async (transaction: Transaction) => {
    const success = await deleteTransaction(transaction._id)
    if (success) {
      toast.success("Transaction deleted successfully")
    }
  }

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { accountCode: "", accountName: "", debit: 0, credit: 0 }],
    })
  }

  const removeEntry = (index: number) => {
    if (formData.entries.length > 2) {
      const newEntries = formData.entries.filter((_, i) => i !== index)
      setFormData({ ...formData, entries: newEntries })
    }
  }

  const updateEntry = (index: number, field: keyof TransactionEntry, value: string | number) => {
    const newEntries = [...formData.entries]
    if (field === "accountCode") {
      const account = accounts.find((acc) => acc.code === value)
      newEntries[index] = {
        ...newEntries[index],
        accountCode: value as string,
        accountName: account?.name || "",
      }
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value }
    }
    setFormData({ ...formData, entries: newEntries })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: "bg-yellow-100 text-yellow-800",
      Posted: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      Draft: Clock,
      Posted: CheckCircle,
      Cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="h-4 w-4" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalDebits = formData.entries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredits = formData.entries.reduce((sum, entry) => sum + entry.credit, 0)
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-gray-600">Manage financial transactions</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading transactions...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-600">Manage financial transactions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>Record a new financial transaction</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTransaction} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Transaction description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Transaction Entries</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.entries.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={entry.accountCode}
                              onValueChange={(value) => updateEntry(index, "accountCode", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account._id} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={entry.debit || ""}
                              onChange={(e) => updateEntry(index, "debit", Number.parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={entry.credit || ""}
                              onChange={(e) => updateEntry(index, "credit", Number.parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell>
                            {formData.entries.length > 2 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeEntry(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-medium">Totals</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(totalDebits)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(totalCredits)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {!isBalanced && totalDebits > 0 && totalCredits > 0 && (
                  <div className="text-red-600 text-sm">
                    ⚠️ Transaction is not balanced. Difference: {formatCurrency(Math.abs(totalDebits - totalCredits))}
                  </div>
                )}
                {isBalanced && totalDebits > 0 && (
                  <div className="text-green-600 text-sm">✓ Transaction is balanced</div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isBalanced || totalDebits === 0}>
                  Create Transaction
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {transactions.filter((t) => t.status === "Draft").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.status === "Posted").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(transactions.reduce((sum, t) => sum + t.totalAmount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Posted">Posted</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-mono">{transaction.transactionNumber}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transaction.status)}
                            <span>{transaction.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(transaction.totalAmount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {transaction.status === "Draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(transaction, "Posted")}
                              >
                                Post
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete transaction "{transaction.transactionNumber}"?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteTransaction(transaction)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {transaction.status === "Posted" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(transaction, "Cancelled")}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
