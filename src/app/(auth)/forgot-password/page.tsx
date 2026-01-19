"use client"
import { Button } from "@/components/common/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card"
import { Input } from "@/components/common/input"

import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push("/login")
  }

  const handleSendLink = () => {
    // Simulate sending email and navigate to reset page
    router.push("/reset-password")
  }

  return (
    
      <Card className="w-100 max-w-md px-8 py-8 border-0 rounded-2xl">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl md:text-[28px] font-bold font-gabarito text-center mb-2">
            Forgot password?
          </CardTitle>
          <p className="">
            Enter your email so that we can send you a password reset link
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <form className="flex flex-col gap-6">
           
            
              <Input
              label="Email"
                id="email"
                type="email"
                placeholder="Email address"
                className="w-full placeholder-roboto h-11 rounded-md border-input px-4"
                required
              />
            
            <div className="flex flex-col gap-4 md:flex-row-reverse mt-4">
              <Button
                type="button"
                onClick={handleSendLink}
                className="flex-1 h-12 "
                variant="primary"
              >
                Send link
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="default"
                className="flex-1 h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
   
  )
}
