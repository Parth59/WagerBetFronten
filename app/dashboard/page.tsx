"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { UserBets } from "@/components/user-bets"
import { useWallet } from "@/contexts/wallet-context"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { account, balance, lockedInBets, totalWinnings, networkName, formatAddress, refreshWalletState } = useWallet()

  // Check wallet state when dashboard loads
  useEffect(() => {
    refreshWalletState()
  }, [refreshWalletState])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-xl font-bold">BetChain</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/explore">
            Explore
          </Link>
          <Link className="text-sm font-medium text-primary hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              {account ? (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">Connected: {formatAddress(account)}</p>
                  <Badge variant="outline" className="text-xs">
                    {networkName}
                  </Badge>
                </div>
              ) : (
                <p className="text-muted-foreground">Connect your wallet to manage your bets</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild disabled={!account}>
                <Link href="/create-bet">
                  <Plus className="mr-2 h-4 w-4" /> Create Bet
                </Link>
              </Button>
              <WalletConnect />
            </div>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <CardDescription>Your current balance and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Available Balance</div>
                    <div className="text-2xl font-bold">{account ? `${balance} ETH` : "Not connected"}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Locked in Bets</div>
                    <div className="text-2xl font-bold">{account ? `${lockedInBets} ETH` : "Not connected"}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Winnings</div>
                    <div className="text-2xl font-bold">{account ? `${totalWinnings} ETH` : "Not connected"}</div>
                  </div>
                </div>
                {!account && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-muted-foreground">Connect your wallet to view your balance and bets</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="active">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="active">Active Bets</TabsTrigger>
                  <TabsTrigger value="created">Created</TabsTrigger>
                  <TabsTrigger value="taken">Taken</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/explore">
                    Find More Bets <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <TabsContent value="active">
                <UserBets type="active" />
              </TabsContent>

              <TabsContent value="created">
                <UserBets type="created" />
              </TabsContent>

              <TabsContent value="taken">
                <UserBets type="taken" />
              </TabsContent>

              <TabsContent value="history">
                <UserBets type="history" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 BetChain. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            FAQ
          </Link>
        </nav>
      </footer>
    </div>
  )
}
