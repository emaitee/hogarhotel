"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/DataTable"
import { useAccounts } from "@/hooks/useAccounts"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const columns = [
  { key: "code", label: "Account Code", sortable: true },
  { key: "name", label: "Account Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "balance", label: "Balance", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

const accountTypes = [
  { value: "asset", label: "Asset", color: "bg-green-100 text-green-800" },
  { value: "liability", label: "Liability", color: "bg-red-100 text-red-800" },
  { value: "equity", label: "Equity", color: "bg-blue-100 text-blue-800" },
  { value: "revenue", label: "Revenue", color: "bg-purple-100 text-purple-800" },
  { value: "expense", label: "Expense", color: "bg-orange-100 text-orange-800" },
]

export default function ChartOfAccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const { accounts, loading, error, createAccount, updateAccount, deleteAccount } = useAccounts()
  const { toast } = useToast()

  const renderCell = (account: any, column: any) => {
    switch (column.key) {
      case "code":
        return <span className="font-mono text-sm">{account.code}</span>
      case "name":
        return <span className="font-medium">{account.name}</span>
      case "type":
        const typeConfig = accountTypes.find((t) => t.value === account.type)
        return <Badge className={typeConfig?.color}>{typeConfig?.label}</Badge>
      case "category":
        return <span className="text-sm">{account.category}</span>
      case "balance":
        return (
          <span
            className={`font-medium ${
              account.balance > 0 ? "text-green-600" : account.balance < 0 ? "text-red-600" : "text-gray-600"
            }`}
          >
            {formatCurrency(Math.abs(account.balance))}
          </span>
        )
      case "status":
        return (
          <Badge className={account.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
            {account.isActive ? "Active" : "Inactive"}
          </Badge>
        )
      case "actions":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setEditingAccount(account)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 bg-transparent"
              onClick={() => handleDeleteAccount(account._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return account[column.key]
    }
  }

  const handleDeleteAccount = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(id)
        toast({
          title: "Success",
          description: "Account deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete account",
          variant: "destructive",
        })
      }
    }
  }

  const accountSummary = accountTypes.map((type) => ({
    ...type,
    count: accounts.filter((acc) => acc.type === type.value).length,
    balance: accounts.filter((acc) => acc.type === type.value).reduce((sum, acc) => sum + acc.balance, 0),
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Link href="/accounting">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounting
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chart of Accounts</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account structure and balances</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <AddAccountForm onClose={() => setIsAddModalOpen(false)} onSubmit={createAccount} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Account Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {accountSummary.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Badge className={type.color + " mb-2"}>{type.label}</Badge>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{type.count}</div>
                  <div className="text-sm text-gray-500">accounts</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                    {formatCurrency(Math.abs(type.balance))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Accounts Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={accounts} columns={columns} searchKey="name" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Account Dialog */}
      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <EditAccountForm account={editingAccount} onClose={() => setEditingAccount(null)} onSubmit={updateAccount} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddAccountForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: any }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const accountData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      category: formData.get("category") as string,
      balance: Number.parseFloat(formData.get("balance") as string) || 0,
      isActive: true,
      description: formData.get("description") as string,
    }

    try {
      await onSubmit(accountData)
      toast({
        title: "Success",
        description: "Account created successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input id="code" name="code" placeholder="e.g., 1003" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input id="name" name="name" placeholder="e.g., Petty Cash" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select name="type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="e.g., Current Assets" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Opening Balance</Label>
        <Input id="balance" name="balance" type="number" placeholder="0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" name="description" placeholder="Account description" />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Add Account
        </Button>
      </div>
    </form>
  )
}

function EditAccountForm({ account, onClose, onSubmit }: { account: any; onClose: () => void; onSubmit: any }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!account) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const updateData = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      category: formData.get("category") as string,
      isActive: formData.get("isActive") === "true",
      description: formData.get("description") as string,
    }

    try {
      await onSubmit(account._id, updateData)
      toast({
        title: "Success",
        description: "Account updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input id="code" name="code" defaultValue={account.code} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input id="name" name="name" defaultValue={account.name} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select name="type" defaultValue={account.type} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={account.category} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive">Status</Label>
        <Select name="isActive" defaultValue={account.isActive.toString()}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" defaultValue={account.description || ""} />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Update Account
        </Button>
      </div>
    </form>
  )
}
