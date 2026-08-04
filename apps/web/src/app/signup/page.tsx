"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button, Input } from "@heroui/react"
import { User, Mail, Lock, Building, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-medium bg-foreground text-background flex items-center justify-center font-bold text-lg mx-auto">
            AI
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Publishing OS</h1>
          <p className="text-xs text-default-400">Get started with your multi-tenant publishing platform</p>
        </div>

        {/* Signup Card */}
        <Card>
          <CardHeader className="flex flex-col items-start pb-2">
            <h2 className="text-base font-semibold">Create an Account</h2>
            <p className="text-xs text-default-400">Setup your organization workspace and launch autonomous AI publishing</p>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSignup} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-default-500 font-medium">Full Name</label>
                <Input
                  type="text"
                  required
                  placeholder="Kadam Raval"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  
                 
                />
              </div>

              <div className="space-y-1">
                <label className="text-default-500 font-medium">Organization Name</label>
                <Input
                  type="text"
                  required
                  placeholder="Acme Media Publishing"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  
                 
                />
              </div>

              <div className="space-y-1">
                <label className="text-default-500 font-medium">Work Email</label>
                <Input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                 
                />
              </div>

              <div className="space-y-1">
                <label className="text-default-500 font-medium">Password</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                 
                />
              </div>

              <Button type="submit" className="w-full text-xs font-semibold mt-2 flex items-center justify-center gap-2" isDisabled={loading}>
                <span>{loading ? "Creating Account..." : "Create Account & Workspace"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Footer Link */}
        <p className="text-center text-xs text-default-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
