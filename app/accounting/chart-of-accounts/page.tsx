"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { useAccounts, type Account, type CreateAccountData } from "@/hooks/useAccounts"
import { toast } from "sonner"

const accountTypes = ["Asset", "Liability", "Equity", "Revenue", "Expense"] as const
const accountCategories = {
  Asset: ["Current Assets", "Fixed Assets", "Other Assets"],
  Liability: ["Current Liabilities", "Long-term Liabilities"],
  Equity: ["Owner's Equity", "Retained Earnings"],
  Revenue: ["Operating Revenue", "Other Revenue"],
  Expense: ["Cost of Sales", "Operating Expenses", "Other Expenses"],
}

export default function ChartOfAccountsPage() {
  const { accounts, loading, createAccount, updateAccount, deleteAccount } = useAccounts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState<CreateAccountData>({
    code: "",
    name: "",
    type: "Asset",
    category: "",
    balance: 0,
    description: "",
  })

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || account.type === filterType
    return matchesSearch && matchesType
  })

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createAccount(formData)
    if (success) {
      setIsCreateDialogOpen(false)
      setFormData({
        code: "",
        name: "",
        type: "Asset",
        category: "",
        balance: 0,
        description: "",
      })
    }
  }

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAccount) return

    const success = await updateAccount(editingAccount._id, formData)
    if (success) {
      setIsEditDialogOpen(false)
      setEditingAccount(null)
      setFormData({
        code: "",
        name: "",
        type: "Asset",
        category: "",
        balance: 0,
        description: "",
      })
    }
  }

  const handleDeleteAccount = async (account: Account) => {
    const success = await deleteAccount(account._id)
    if (success) {
      toast.success(`Account ${account.name} deleted successfully`)
    }
  }

  const openEditDialog = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      category: account.category,
      balance: account.balance,
      description: account.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Asset: "bg-green-100 text-green-800",
      Liability: "bg-red-100 text-red-800",
      Equity: "bg-blue-100 text-blue-800",
      Revenue: "bg-purple-100 text-purple-800",
      Expense: "bg-orange-100 text-orange-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const AccountForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., 1000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Cash"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                type: value as CreateAccountData["type"],
                category: "", // Reset category when type changes
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {accountCategories[formData.type]?.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Opening Balance</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: Number.parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Account description..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateDialogOpen(false)
            setIsEditDialogOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Update Account" : "Create Account"}</Button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Chart of Accounts</h1>
            <p className="text-gray-600">Manage your accounting structure</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading accounts...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chart of Accounts</h1>
          <p className="text-gray-600">Manage your accounting structure</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Add a new account to your chart of accounts</DialogDescription>
            </DialogHeader>
            <AccountForm onSubmit={handleCreateAccount} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {accountTypes.map((type) => {
          const typeAccounts = accounts.filter((account) => account.type === type)
          const totalBalance = typeAccounts.reduce((sum, account) => sum + account.balance, 0)

          return (
            <Card key={type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{typeAccounts.length}</div>
                <p className="text-xs text-gray-600">Balance: {formatCurrency(totalBalance)}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>View and manage all accounts in your chart of accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell className="font-mono">{account.code}</TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(account.type)}>{account.type}</Badge>
                      </TableCell>
                      <TableCell>{account.category}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(account)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the account "{account.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAccount(account)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update account information</DialogDescription>
          </DialogHeader>
          <AccountForm onSubmit={handleEditAccount} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
