"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button, Input } from "@heroui/react"
import { Lock, Mail, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
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
          <p className="text-xs text-default-400">Sign in to manage your autonomous publishing network</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="flex flex-col items-start pb-2">
            <h2 className="text-base font-semibold">Sign In</h2>
            <p className="text-xs text-default-400">Enter your credentials to access your organization dashboard</p>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
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
                <div className="flex justify-between items-center">
                  <label className="text-default-500 font-medium">Password</label>
                  <a href="#" className="text-default-400 hover:underline text-[11px]">Forgot?</a>
                </div>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                 
                />
              </div>

              <Button type="submit" className="w-full text-xs font-semibold mt-2 flex items-center justify-center gap-2" isDisabled={loading}>
                <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signup Footer Link */}
        <p className="text-center text-xs text-default-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-foreground hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  )
}
