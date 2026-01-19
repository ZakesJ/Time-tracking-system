"use client"
import { Button } from "@/components/common/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/card"
import { Input } from "@/components/common/input"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"



export default function LoginPage() {

  const router = useRouter();


  const handleLogin = () => {
    router.push("/");
  }


  return (
   
      <Card className="p-8 sm:p-16 border-0 rounded-2xl max-w-md sm:max-w-none">
        <CardHeader className="text-center pb-0 pt-8 sm:pt-0 sm:pb-0 px-0 m-0">
          <div className="mx-auto mb-4">
            <Image 
              src="/logos/falcorp-logo-dark.svg"
              alt="Logo" 
              width={100}
              height={100}
              className="h-24 sm:h-35"
            />
          </div>
           <CardTitle className="text-2xl md:text-[28px] font-bold font-gabarito text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent className="w-80 sm:w-full flex justify-center">
          <form className="flex flex-col gap-6 w-full sm:w-100 max-w-sm sm:max-w-lg">
           
             
              <Input
              label="Email Address"
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full placeholder-roboto placeholder:text-sm sm:placeholder:text-sm h-10 sm:h-11 rounded-md border-input px-3 sm:px-4"
                required
              />
           
           
             
              <Input
              label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full placeholder-roboto placeholder:text-sm sm:placeholder:text-sm h-10 sm:h-11 rounded-md border-input px-3 sm:px-4"
                required
              />
          
            <Button onClick={handleLogin} variant="primary" type="submit" className="w-full mt-4 h-12   font-bold">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link 
            href="/forgot-password"
            
            className="text-sm  underline font-roboto font-bold"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    
  )
}

