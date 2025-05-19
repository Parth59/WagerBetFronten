"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Clock, DollarSign, Users } from "lucide-react"
import { ethers } from "ethers"
import { BETTING_CONTRACT_ADDRESS, BETTING_CONTRACT_ABI, DESTINATION_RPC_URL } from "@/lib/contracts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { UserBets } from "@/components/user-bets"
import { useWallet } from "@/contexts/wallet-context"
import { Badge } from "@/components/ui/badge"

interface Bet {
  id: bigint;
  description: string;
  stake: bigint;
  expiryTimestamp: bigint;
  creator: string;
  joiner: string;
  resolver: string;
  status: number;
  winner: string;
}

interface FormattedBet {
  id: bigint;
  title: string;
  description: string;
  amount: string;
  stake: bigint;
  token: string;
  expiresAt: string;
  creator: string;
  joiner: string;
  resolver: string;
  status: string;
  role: string;
  winner: string;
}

export default function Dashboard() {
  const { account, balance, networkName, formatAddress, refreshWalletState } = useWallet()
  const [activeBets, setActiveBets] = useState<FormattedBet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lockedAmount, setLockedAmount] = useState("0")
  const [totalWinnings, setTotalWinnings] = useState("0")

  // Fetch active bets where user is creator or joiner
  useEffect(() => {
    async function fetchActiveBets() {
      if (!account) {
        setActiveBets([])
        setLockedAmount("0")
        setTotalWinnings("0")
        setIsLoading(false)
        return
      }

      try {
        const provider = new ethers.JsonRpcProvider(DESTINATION_RPC_URL)
        const contract = new ethers.Contract(
          BETTING_CONTRACT_ADDRESS,
          BETTING_CONTRACT_ABI,
          provider
        )

        // Get all user bets directly from the contract
        const userBets = await contract.getAllUserBets(account) as Bet[]
        
        // Transform the data for display
        const formattedBets = userBets.map((bet: Bet) => ({
          id: bet.id,
          title: bet.description.split(" - ")[0] || bet.description,
          description: bet.description,
          amount: ethers.formatEther(bet.stake),
          stake: bet.stake,
          token: "ETH",
          expiresAt: new Date(Number(bet.expiryTimestamp) * 1000).toLocaleDateString(),
          creator: bet.creator,
          joiner: bet.joiner,
          resolver: bet.resolver,
          status: getBetStatus(Number(bet.status)),
          role: bet.creator.toLowerCase() === account.toLowerCase() ? "Creator" : 
                bet.joiner.toLowerCase() === account.toLowerCase() ? "Joiner" : "Resolver",
          winner: bet.winner
        }))

        // Calculate total locked amount (sum of stakes for unresolved bets)
        const unresolvedBets = formattedBets.filter((bet: FormattedBet) => bet.status !== "Resolved")
        const totalLocked = unresolvedBets.reduce((sum: bigint, bet: FormattedBet) => {
          // If user is creator or joiner, add the stake amount
          if (bet.role === "Creator" || bet.role === "Joiner") {
            return sum + bet.stake
          }
          return sum
        }, BigInt(0))

        // Calculate total winnings (sum of stakes for resolved bets where user is winner)
        const resolvedBets = formattedBets.filter((bet: FormattedBet) => bet.status === "Resolved")
        const totalWon = resolvedBets.reduce((sum: bigint, bet: FormattedBet) => {
          // If user is the winner, add the stake amount
          if (bet.winner.toLowerCase() === account.toLowerCase()) {
            return sum + bet.stake
          }
          return sum
        }, BigInt(0))

        setLockedAmount(ethers.formatEther(totalLocked))
        setTotalWinnings(ethers.formatEther(totalWon))
        setActiveBets(formattedBets)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching user bets:", err)
        setError(err.message || "Failed to fetch user bets")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveBets()
  }, [account])

  // Helper function to get bet status
  function getBetStatus(status: number): string {
    switch (status) {
      case 0: return "Open"
      case 1: return "Joined"
      case 2: return "Resolved"
      default: return "Unknown"
    }
  }

  // Check wallet state when dashboard loads
  useEffect(() => {
    refreshWalletState()
  }, [refreshWalletState])

  // Filter bets based on type
  const getFilteredBets = (type: string) => {
    if (!account) return []
    
    switch (type) {
      case "active":
        return activeBets.filter(bet => bet.status !== "Resolved")
      case "created":
        return activeBets.filter(bet => bet.role === "Creator")
      case "joined":
        return activeBets.filter(bet => bet.role === "Joiner")
      case "resolved":
        return activeBets.filter(bet => 
          bet.status === "Resolved" && 
          bet.resolver.toLowerCase() === account.toLowerCase()
        )
      default:
        return activeBets
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <Button asChild disabled={!account}>
                <Link href="/create-bet">
                  <Plus className="mr-2 h-4 w-4" /> Create Bet
                </Link>
              </Button>
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
                    <div className="text-2xl font-bold">{account ? `${lockedAmount} ETH` : "Not connected"}</div>
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
                  <TabsTrigger value="joined">Joined</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/explore">
                    Find More Bets <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <TabsContent value="active">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading active bets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                  </div>
                ) : getFilteredBets("active").length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active bets found</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {getFilteredBets("active").map((bet) => (
                      <Card key={bet.id.toString()}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{bet.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="outline">{bet.role}</Badge>
                              <Badge
                                variant={
                                  bet.status === "Open" ? "secondary" :
                                  bet.status === "Joined" ? "default" : "outline"
                                }
                              >
                                {bet.status}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{bet.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.amount} {bet.token}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Expires: {bet.expiresAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.role === "Creator" ? "Joiner" : bet.role === "Joiner" ? "Creator" : "Resolver"}: {formatAddress(bet.role === "Creator" ? bet.joiner : bet.creator)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="created">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading created bets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                  </div>
                ) : getFilteredBets("created").length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No created bets found</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {getFilteredBets("created").map((bet) => (
                      <Card key={bet.id.toString()}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{bet.title}</CardTitle>
                            <Badge
                              variant={
                                bet.status === "Open" ? "secondary" :
                                bet.status === "Joined" ? "default" :
                                bet.status === "Resolved" ? "destructive" : "outline"
                              }
                            >
                              {bet.status}
                            </Badge>
                          </div>
                          <CardDescription>{bet.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.amount} {bet.token}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Expires: {bet.expiresAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Joiner: {bet.joiner === ethers.ZeroAddress ? "None" : formatAddress(bet.joiner)}
                              </span>
                            </div>
                            {bet.status === "Resolved" && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Winner: {formatAddress(bet.winner)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="joined">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading joined bets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                  </div>
                ) : getFilteredBets("joined").length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No joined bets found</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {getFilteredBets("joined").map((bet) => (
                      <Card key={bet.id.toString()}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{bet.title}</CardTitle>
                            <Badge
                              variant={
                                bet.status === "Open" ? "secondary" :
                                bet.status === "Joined" ? "default" :
                                bet.status === "Resolved" ? "destructive" : "outline"
                              }
                            >
                              {bet.status}
                            </Badge>
                          </div>
                          <CardDescription>{bet.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.amount} {bet.token}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Expires: {bet.expiresAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Creator: {formatAddress(bet.creator)}
                              </span>
                            </div>
                            {bet.status === "Resolved" && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Winner: {formatAddress(bet.winner)}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resolved">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading resolved bets...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                  </div>
                ) : getFilteredBets("resolved").length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No resolved bets found</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {getFilteredBets("resolved").map((bet) => (
                      <Card key={bet.id.toString()}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{bet.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="outline">{bet.role}</Badge>
                              <Badge variant="destructive">Resolved</Badge>
                            </div>
                          </div>
                          <CardDescription>{bet.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.amount} {bet.token}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Expired: {bet.expiresAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {bet.role === "Creator" ? "Joiner" : bet.role === "Joiner" ? "Creator" : "Resolver"}: {formatAddress(bet.role === "Creator" ? bet.joiner : bet.creator)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Winner: {formatAddress(bet.winner)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
