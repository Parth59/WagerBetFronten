"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, DollarSign, Filter, Search, Users } from "lucide-react"
import { ethers } from "ethers"
import { useWallet } from "@/contexts/wallet-context"
import { BETTING_CONTRACT_ADDRESS, BETTING_CONTRACT_ABI, DESTINATION_CHAIN_ID, DESTINATION_RPC_URL } from "@/lib/contracts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ExploreBets() {
  const { toast } = useToast()
  const { account } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [bets, setBets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    async function fetchBets() {
      try {
        const provider = new ethers.JsonRpcProvider(DESTINATION_RPC_URL)
        
        // Check if provider is connected
        try {
          await provider.getNetwork()
        } catch (error) {
          throw new Error("Failed to connect to RPC provider. Please check your internet connection.")
        }

        const contract = new ethers.Contract(
          BETTING_CONTRACT_ADDRESS,
          BETTING_CONTRACT_ABI,
          provider
        )

        // Get active bets directly from the contract
        const activeBets = await contract.getActiveBets()
        
        // Transform the blockchain data into our UI format
        const formattedBets = activeBets.map((bet: any) => ({
          title: bet.description.split(" - ")[0] || bet.description,
          description: bet.description,
          category: getCategoryFromDescription(bet.description),
          amount: ethers.formatEther(bet.stake),
          token: "ETH",
          expiresAt: new Date(Number(bet.expiryTimestamp) * 1000).toLocaleDateString(),
          takers: bet.joiner !== ethers.ZeroAddress ? 1 : 0,
          id: bet.id,
          creator: bet.creator,
          resolver: bet.resolver,
          status: getBetStatus(bet.status)
        }))

        setBets(formattedBets)
        setError(null)
        retryCount = 0 // Reset retry count on success
      } catch (err: any) {
        console.error("Error fetching bets:", err)
        
        // Handle retry logic
        if (retryCount < maxRetries) {
          retryCount++
          setError(`Connection failed. Retrying... (${retryCount}/${maxRetries})`)
          setTimeout(fetchBets, retryDelay)
        } else {
          setError(err.message || "Failed to fetch bets. Please try again later.")
          setBets([])
        }
      } finally {
        if (retryCount === 0) {
          setIsLoading(false)
        }
      }
    }

    fetchBets()

    // Cleanup function to prevent memory leaks
    return () => {
      retryCount = maxRetries // Stop retrying if component unmounts
    }
  }, [])

  // Filter bets based on search query and category
  const filteredBets = bets.filter((bet) => {
    const matchesSearch =
      bet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || bet.category.toLowerCase() === category.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleTakeBet = async (bet: any) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to take a bet",
        variant: "destructive"
      })
      return
    }

    try {
      if (!window.ethereum) {
        throw new Error("No ethereum provider found")
      }

      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        BETTING_CONTRACT_ADDRESS,
        BETTING_CONTRACT_ABI,
        signer
      )

      const stakeInWei = ethers.parseEther(bet.amount.toString())
      alert(bet.id);
      alert(stakeInWei);
      alert(bet.creator);
      const tx = await contract.joinBet(
        DESTINATION_CHAIN_ID,
        bet.id,
        bet.creator,
        account,
        stakeInWei,
        { value: stakeInWei } // Send the same amount as msg.value
      )

      await tx.wait()

      toast({
        title: "Bet taken successfully",
        description: "You have successfully joined the bet",
      })

      // Refresh the bets list
      window.location.reload()
    } catch (error: any) {
      console.error("Error taking bet:", error)
      toast({
        title: "Error taking bet",
        description: error.message || "Failed to take bet",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
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
            <Link className="text-sm font-medium text-primary hover:underline underline-offset-4" href="/explore">
              Explore
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
          </nav>
        </header>
        <main className="flex-1 py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-lg">Loading bets...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
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
            <Link className="text-sm font-medium text-primary hover:underline underline-offset-4" href="/explore">
              Explore
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
          </nav>
        </header>
        <main className="flex-1 py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-lg text-destructive">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
          <Link className="text-sm font-medium text-primary hover:underline underline-offset-4" href="/explore">
            Explore
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Explore Bets</h1>
              <p className="text-muted-foreground">Browse and take bets from other users</p>
            </div>
            <Button asChild>
              <Link href="/create-bet">Create Your Own Bet</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="politics">Politics</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredBets.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No bets found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBets.map((bet, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{bet.title}</CardTitle>
                        <Badge
                          variant={
                            bet.status === "Open" ? "secondary" :
                            bet.status === "Active" ? "default" :
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
                          <span className="text-sm">{bet.takers} takers</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleTakeBet(bet)}
                        disabled={!account || bet.creator === account}
                      >
                        {!account ? "Connect Wallet" : bet.creator === account ? "Your Bet" : "Take This Bet"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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

// Helper function to determine category from description
function getCategoryFromDescription(description: string): string {
  const lowerDesc = description.toLowerCase()
  if (lowerDesc.includes("bitcoin") || lowerDesc.includes("ethereum") || lowerDesc.includes("crypto")) {
    return "Crypto"
  }
  if (lowerDesc.includes("championship") || lowerDesc.includes("world cup") || lowerDesc.includes("nba")) {
    return "Sports"
  }
  if (lowerDesc.includes("president") || lowerDesc.includes("election")) {
    return "Politics"
  }
  if (lowerDesc.includes("stock") || lowerDesc.includes("market cap")) {
    return "Finance"
  }
  return "Other"
}

function getBetStatus(status: number): string {
  switch (status) {
    case 0: return "Open"
    case 1: return "Active"
    case 2: return "Resolved"
    default: return "Unknown"
  }
}
