"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Check, X, Calendar, Trash2, MoreVertical } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { showToast } from "@/lib/utils/toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

export default function LeavesPage() {
  const { data: session } = useSession()
  const { data: leaves, mutate } = useSWR("/api/leaves", fetcher)
  const { data: stats } = useSWR("/api/leaves/stats", fetcher)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to create leave request")

      showToast("success", "Leave request submitted successfully")
      setIsCreateOpen(false)
      setFormData({ type: "Casual", startDate: "", endDate: "", reason: "" })
      mutate()
    } catch (error) {
      showToast("error", "Error submitting leave request")
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      })

      if (!res.ok) throw new Error("Failed to approve leave")

      showToast("success", "Leave approved successfully", true)
      mutate()
    } catch (error) {
      showToast("error", "Error approving leave")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      })

      if (!res.ok) throw new Error("Failed to reject leave")

      showToast("warning", "Leave rejected", true)
      mutate()
    } catch (error) {
      showToast("error", "Error rejecting leave")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave request?")) return

    try {
      const res = await fetch(`/api/leaves/${id}`, { method: "DELETE" })

      if (!res.ok) throw new Error("Failed to delete leave")

      showToast("success", "Leave deleted successfully")
      mutate()
    } catch (error) {
      showToast("error", "Error deleting leave")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const canManageLeaves = session?.user?.role === "HR" || session?.user?.role === "SuperAdmin"

  const pendingLeaves = leaves?.filter((l: any) => l.status === "Pending") || []
  const approvedLeaves = leaves?.filter((l: any) => l.status === "Approved") || []
  const rejectedLeaves = leaves?.filter((l: any) => l.status === "Rejected") || []

  const LeaveForm = () => (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Leave Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Casual">Casual Leave</SelectItem>
            <SelectItem value="Sick">Sick Leave</SelectItem>
            <SelectItem value="Annual">Annual Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  )

  const LeaveCard = ({ leave, showActions = true }: { leave: any; showActions?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-4 sm:p-6"
    >
     <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex-1 space-y-3">
<div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1 break-all">
            <h3 className="font-semibold text-base sm:text-lg">{leave.user?.name || "Unknown User"}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium w-fit ${getStatusColor(leave.status)}`}>
              {leave.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{leave.user?.email}</p>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-1">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">{leave.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-1">
              <span className="font-medium">Duration:</span>
              <span className="text-muted-foreground">
                {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-1">
              <span className="font-medium">Reason:</span>
              <span className="text-muted-foreground break-words">{leave.reason}</span>
            </div>
            {leave.approvedBy && (
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <span className="font-medium">{leave.status === "Approved" ? "Approved" : "Rejected"} by:</span>
                <span className="text-muted-foreground">{leave.approvedBy.name}</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <>
            {/* Desktop Actions */}
<div className="hidden sm:flex flex-wrap gap-2">
              {canManageLeaves && leave.status === "Pending" ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleApprove(leave._id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(leave._id)}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              ) : (
                !canManageLeaves &&
                leave.status === "Pending" && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(leave._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden">
              {canManageLeaves && leave.status === "Pending" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleApprove(leave._id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReject(leave._id)}>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                !canManageLeaves &&
                leave.status === "Pending" && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(leave._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage leave applications and approvals
          </p>
        </div>

        {isDesktop ? (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave request</DialogDescription>
              </DialogHeader>
              <LeaveForm />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DrawerTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Apply for Leave</DrawerTitle>
                <DrawerDescription>Submit a new leave request</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <LeaveForm />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {stats && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
<TabsList className="flex w-full overflow-x-auto no-scrollbar justify-between gap-2">
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">Pending</span>
            <span className="ml-1">({pendingLeaves.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Approved</span>
            <span className="sm:hidden">Approved</span>
            <span className="ml-1">({approvedLeaves.length})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Rejected</span>
            <span className="sm:hidden">Rejected</span>
            <span className="ml-1">({rejectedLeaves.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 sm:space-y-4">
          {pendingLeaves.map((leave: any) => (
            <LeaveCard key={leave._id} leave={leave} showActions={true} />
          ))}
          {pendingLeaves.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">No pending leave requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-3 sm:space-y-4">
          {approvedLeaves.map((leave: any) => (
            <LeaveCard key={leave._id} leave={leave} showActions={false} />
          ))}
          {approvedLeaves.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">No approved leave requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-3 sm:space-y-4">
          {rejectedLeaves.map((leave: any) => (
            <LeaveCard key={leave._id} leave={leave} showActions={false} />
          ))}
          {rejectedLeaves.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">No rejected leave requests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}