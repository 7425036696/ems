"use client"

import type React from "react"
import { useState, useTransition, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { User } from "lucide-react"
import { showToast } from "@/lib/utils/toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isPending, startTransition] = useTransition()

  // Separate states for each form
  const [nameForm, setNameForm] = useState("")
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Set initial name when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setNameForm(session.user.name)
    }
  }, [session?.user?.name])

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()

    // Frontend validation
    if (!nameForm || nameForm.trim() === "") {
      showToast("error", "Name is required")
      return
    }

    if (nameForm.trim() === session?.user?.name) {
      showToast("error", "Name is same as current name")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nameForm.trim() }),
        })

        const data = await response.json()

        if (!response.ok) {
          showToast("error", data.error || "Name update failed")
          return
        }
        await update({ name: nameForm.trim() })
        showToast("success", "Name updated successfully")
      } catch (error) {
        showToast("error", "Something went wrong")
      }
    })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Frontend validation
    if (!passwordForm.currentPassword) {
      showToast("error", "Current password is required")
      return
    }

    if (!passwordForm.newPassword) {
      showToast("error", "New password is required")
      return
    }

    if (!passwordForm.confirmPassword) {
      showToast("error", "Confirm password is required")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "Passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          showToast("error", data.error || "Password change failed")
          return
        }

        await update()
        showToast("success", "Password changed successfully")

        // Reset password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } catch (error) {
        showToast("error", "Something went wrong")
      }
    })
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Name Update Form */}
          <Card>
            <CardHeader>
              <CardTitle>Update Name</CardTitle>
              <CardDescription>Change your display name</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={nameForm}
                    onChange={(e) => setNameForm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Name"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change Form */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value
                    })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Info - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your current account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{session?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Role: {session?.user?.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
