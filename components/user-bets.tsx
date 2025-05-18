"use client"

import { Clock, DollarSign, Users } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import { BETTING_CONTRACT_ADDRESS, BETTING_CONTRACT_ABI } from "@/lib/contracts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserBetsProps {
  type: "active" | "created" | "taken" | "history"
}

export function UserBets({ type }: UserBetsProps) {
  const { account } = useWallet()
  const [bets, setBets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBets() {
      if (!account || type !== "active") {
        setBets([])
        setIsLoading(false)
        return
      }

      try {
        if (!window.ethereum) {
          throw new Error("No ethereum provider found")
        }
        const provider = new ethers.BrowserProvider(window.ethereum as any)
        const contract = new ethers.Contract(
          BETTING_CONTRACT_ADDRESS,
          BETTING_CONTRACT_ABI,
          provider
        )

        const activeBets = await contract.getActiveBets(account)
        
        // Transform the blockchain data into our UI format
        const formattedBets = activeBets.map((bet: any) => ({
          title: bet.title,
          description: bet.description,
          status: getBetStatus(bet.status),
          amount: ethers.formatEther(bet.amount),
          token: "ETH",
          expiresAt: new Date(Number(bet.expirationTime) * 1000).toLocaleDateString(),
          takers: bet.joiner !== ethers.ZeroAddress ? 1 : 0,
          outcome: null
        }))

        setBets(formattedBets)
        setError(null)
      } catch (err) {
        console.error("Error fetching bets:", err)
        setError("Failed to fetch bets from blockchain")
        setBets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBets()
  }, [account, type])

  // If no wallet is connected, show a message
  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Wallet not connected</h3>
        <p className="text-muted-foreground mt-1">Connect your wallet to view your bets</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">Loading bets...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium text-destructive">Error</h3>
        <p className="text-muted-foreground mt-1">{error}</p>
      </div>
    )
  }

  if (bets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No bets found</h3>
        <p className="text-muted-foreground mt-1">
          {type === "active" && "You don't have any active bets at the moment."}
          {type === "created" && "You haven't created any bets yet."}
          {type === "taken" && "You haven't taken any bets yet."}
          {type === "history" && "You don't have any completed bets in your history."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bets.map((bet, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{bet.title}</CardTitle>
              <Badge variant={getBadgeVariant(bet.status)}>{bet.status}</Badge>
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
              {bet.takers !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{bet.takers} takers</span>
                </div>
              )}
              {bet.outcome && (
                <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                  <strong>Outcome:</strong> {bet.outcome}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {type === "active" && (
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            )}
            {type === "created" && bet.status === "Open" && (
              <Button variant="outline" className="w-full">
                Cancel Bet
              </Button>
            )}
            {type === "history" && (
              <Button variant="outline" className="w-full">
                View Transaction
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function getBadgeVariant(status: string) {
  switch (status) {
    case "Open":
      return "secondary"
    case "Active":
      return "default"
    case "Resolved":
      return "destructive"
    default:
      return "outline"
  }
}

function getBetStatus(status: number): string {
  switch (status) {
    case 0: return "Open"
    case 1: return "Active"
    case 2: return "Resolved"
    default: return "Unknown"
  }
}

// Generate bets based on the account address to make it feel personalized
function getBetsByType(type: string, account: string) {
  // Use the account address to seed the bet generation
  // This makes the bets appear consistent for the same account
  const addressSeed = Number.parseInt(account.slice(-6), 16) % 100

  // Determine how many bets to show based on the type and seed
  let betCount = 0
  switch (type) {
    case "active":
      betCount = (addressSeed % 3) + 1 // 1-3 active bets
      break
    case "created":
      betCount = (addressSeed % 2) + 1 // 1-2 created bets
      break
    case "taken":
      betCount = addressSeed % 2 // 0-1 taken bets
      break
    case "history":
      betCount = (addressSeed % 3) + 1 // 1-3 historical bets
      break
    default:
      betCount = 0
  }

  // If the seed results in 0 bets, return empty array
  if (betCount === 0) return []

  // Base bets that we'll customize based on the account
  const baseBets = {
    active: [
      {
        title: "Bitcoin to $100K",
        description: "Bitcoin will reach $100,000 before December 31, 2025",
        status: "Active",
        amount: (0.3 + (addressSeed % 5) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Dec 31, 2025",
        takers: (addressSeed % 5) + 1,
      }
    ],
    created: [
      {
        title: "Ethereum Flippening",
        description: "Ethereum market cap will exceed Bitcoin's before 2027",
        status: "Open",
        amount: (1.5 + (addressSeed % 10) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Dec 31, 2026",
        takers: addressSeed % 5,
      }
    ],
    taken: [
      {
        title: "Lakers Championship",
        description: "Lakers will win the NBA Championship in the 2025-2026 season",
        status: "Active",
        amount: (0.2 + (addressSeed % 3) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Jun 30, 2026",
      },
      {
        title: "SpaceX Mars Mission",
        description: "SpaceX will land humans on Mars before 2030",
        status: "Active",
        amount: (0.5 + (addressSeed % 5) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Dec 31, 2029",
      },
    ],
    history: [
      {
        title: "Bitcoin to $80K",
        description: "Bitcoin will reach $80,000 before June 30, 2025",
        status: addressSeed % 2 === 0 ? "Won" : "Lost",
        amount: (0.3 + (addressSeed % 4) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Jun 30, 2025",
        outcome:
          addressSeed % 2 === 0
            ? `Bitcoin reached $82,500 on June 15, 2025. You won ${(0.6 + (addressSeed % 8) / 10).toFixed(1)} ETH.`
            : `Bitcoin only reached $78,300 by June 30, 2025. You lost ${(0.3 + (addressSeed % 4) / 10).toFixed(1)} ETH.`,
      },
      {
        title: "Super Bowl Winner",
        description: "Kansas City Chiefs will win the Super Bowl in 2025",
        status: addressSeed % 3 === 0 ? "Won" : "Lost",
        amount: (0.2 + (addressSeed % 3) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Feb 15, 2025",
        outcome:
          addressSeed % 3 === 0
            ? `The Chiefs won the Super Bowl. You won ${(0.4 + (addressSeed % 6) / 10).toFixed(1)} ETH.`
            : `The Bills won the Super Bowl. You lost ${(0.2 + (addressSeed % 3) / 10).toFixed(1)} ETH.`,
      },
      {
        title: "Apple Product Launch",
        description: "Apple will release AR glasses before the end of 2024",
        status: addressSeed % 2 === 1 ? "Won" : "Lost",
        amount: (0.4 + (addressSeed % 5) / 10).toFixed(1),
        token: "ETH",
        expiresAt: "Dec 31, 2024",
        outcome:
          addressSeed % 2 === 1
            ? `Apple released Vision Pro AR glasses in November 2024. You won ${(0.8 + (addressSeed % 10) / 10).toFixed(1)} ETH.`
            : `Apple did not release AR glasses in 2024. You lost ${(0.4 + (addressSeed % 5) / 10).toFixed(1)} ETH.`,
      },
    ],
  }

  // Return the appropriate number of bets based on the type and count
  switch (type) {
    case "active":
      return baseBets.active.slice(0, betCount)
    case "created":
      return baseBets.created.slice(0, betCount)
    case "taken":
      return baseBets.taken.slice(0, betCount)
    case "history":
      return baseBets.history.slice(0, betCount)
    default:
      return []
  }
}
