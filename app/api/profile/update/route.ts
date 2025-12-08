import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { User } from "@/lib/models/User"
import bcrypt from "bcryptjs"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, currentPassword, newPassword } = await request.json()
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let hasChanges = false

    // Update name if provided
    if (name && name.trim() !== "") {
      if (name.trim() !== user.name) {
        user.name = name.trim()
        hasChanges = true
      }
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await user.comparePassword(currentPassword)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
      }

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
      hasChanges = true
    }

    if (!hasChanges) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    await user.save()
    
    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: { 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role 
      }
    })
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
