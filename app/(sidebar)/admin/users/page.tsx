"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import UsersSkeleton from "@/components/users-skeleton"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UsersPage() {
  const { data: users, mutate } = useSWR("/api/users", fetcher)
  const { data: departments } = useSWR("/api/departments", fetcher)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    department: "",
  })

  const handleCreate = async () => {
    if (formData.password.length < 6) {
      toast.error("Minimum password length is 6 characters")
      return
    }
    try {

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Something went wrong")
        return
      }


      toast.success("User created successfully")
      setIsCreateOpen(false)
      setFormData({ name: "", email: "", password: "", role: "User", department: "" })
      mutate()
    } catch (error) {
      toast.error("Error creating user")
    }
  }

  const handleEdit = async () => {
    if (formData.password.length < 6) {
      toast.error("Minimum password length is 6 characters")
      return
    }
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update user")

      toast.success("User updated successfully")
      setIsEditOpen(false)
      setSelectedUser(null)
      mutate()
    } catch (error) {
      toast.error("Error updating user")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })

      if (!res.ok) throw new Error("Failed to delete user")

      toast.success("User deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Error deleting user")
    }
  }

  const openEditDialog = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department?._id,
    })
    setIsEditOpen(true)
  }

  const filteredUsers = users?.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  if (!users || !departments) {
    return <UsersSkeleton />;
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 w-full max-w-screen-xl mx-auto px-3 sm:px-6 py-4 sm:py-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-0">Manage system users and their roles</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Create New User</DialogTitle>
                <DialogDescription className="text-sm">Add a new user to the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name" className="text-sm">Name</Label>
                  <Input
                    id="name"
                    className="w-full h-10 sm:h-11"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="w-full h-10 sm:h-11"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="w-full h-10 sm:h-11"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="role" className="text-sm">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="department" className="text-sm">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept: any) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full h-10 sm:h-11 text-sm font-medium">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-10 sm:h-11 text-sm"
          />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden lg:block w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 xl:px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 xl:px-6 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 xl:px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 xl:px-6 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                  <th className="px-4 xl:px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user: any) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 xl:px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-4 xl:px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 xl:px-6 py-4 text-sm">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 py-4 text-sm text-muted-foreground">{user.department?.name || "—"}</td>
                    <td className="px-4 xl:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet list */}
          <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
            {filteredUsers?.map((user: any) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-border bg-background p-3 sm:p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium truncate">{user.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary whitespace-nowrap">
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {user.department?.name || "No department"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit user"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => openEditDialog(user)}
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete user"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-sm">Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-name" className="text-sm">Name</Label>
              <Input
                id="edit-name"
                className="w-full h-10 sm:h-11"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-email" className="text-sm">Email</Label>
              <Input
                id="edit-email"
                type="email"
                className="w-full h-10 sm:h-11"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-password" className="text-sm">Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                className="w-full h-10 sm:h-11"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-role" className="text-sm">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="w-full h-10 sm:h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="edit-department" className="text-sm">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="w-full h-10 sm:h-11">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept: any) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEdit} className="w-full h-10 sm:h-11 text-sm font-medium">
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}