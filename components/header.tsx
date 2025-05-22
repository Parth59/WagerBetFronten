"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletConnect } from "./wallet-connect"
import { Zap } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">WagerBet</span>
      </Link>

      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link 
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/" ? "text-primary" : ""
          }`} 
          href="/"
        >
          Home
        </Link>
        <Link 
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/explore" ? "text-primary" : ""
          }`} 
          href="/explore"
        >
          Explore
        </Link>
        <Link 
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/resolve" ? "text-primary" : ""
          }`} 
          href="/resolve"
        >
          Resolve
        </Link>
        <Link 
          className={`text-sm font-medium hover:underline underline-offset-4 ${
            pathname === "/dashboard" ? "text-primary" : ""
          }`} 
          href="/dashboard"
        >
          Dashboard
        </Link>
      </nav>
      <div className="ml-4">
          <WalletConnect />
        </div>
    </header>
  )
} 