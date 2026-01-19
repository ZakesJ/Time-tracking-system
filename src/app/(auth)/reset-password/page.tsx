"use client"
import { useState } from "react"
import { Button } from "@/components/common/button"
import {
  Card,
  CardContent,
} from "@/components/common/card"
import { Input } from "@/components/common/input"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleCancel = () => {
    router.push("/login")
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add password validation and API call
    // For now, just show success view
    setShowSuccess(true)
  }

  const handleLogin = () => {
    router.push("/login")
  }

  // Success view
  if (showSuccess) {
    return (
      <Card className="w-full max-w-md px-12 py-8 border-0 rounded-2xl bg-white">
        <CardContent className="flex flex-col items-center justify-center gap-8 px-0">
          {/* Success Icon */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-[137.5px] w-[150px] relative">
              <Image
                src="/icons/animated/success-icon.gif"
                alt="Success"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Heading */}
            <h1 className="text-[28px] font-bold font-gabarito  text-center leading-[1.2]">
              Password successfully reset!
            </h1>
            
            {/* Description */}
            <p className="text-base font-roboto text-black text-center w-[333px] leading-[1.2]">
              You can now login using your new password.
            </p>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="h-12 min-w-[144px] px-6 py-2 bg-primary text-white font-bold font-roboto text-base rounded-lg hover:bg-navy-700"
            variant="primary"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Form view
  return (
    <Card className="w-full max-w-md px-12 py-12 border-0 rounded-2xl bg-white">
      <CardContent className="flex flex-col items-center justify-center gap-8 px-0">
        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-[28px] font-bold font-gabarito  leading-[1.2]">
            Reset password
          </h1>
          <p className="text-base font-roboto text-black leading-[1.2]">
            Please create a new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="flex flex-col gap-6 w-full items-center">
          <div className="flex flex-col gap-6 w-full">
            {/* New Password Input */}
            <Input
              label="New password"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Choose a password that has 8+ characters, at least 1 number and 1 uppercase character"
              className="w-full h-12 rounded-md"
              required
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 rounded-md"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 w-full mt-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex-1 h-12 min-w-[144px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 h-12 min-w-[144px]"
            >
              Reset password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
  