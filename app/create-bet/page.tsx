"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Info } from "lucide-react"
import { ethers } from "ethers"
import { useWallet } from "@/contexts/wallet-context"
import { BETTING_CONTRACT_ADDRESS, BETTING_CONTRACT_ABI, DESTINATION_CHAIN_ID } from "@/lib/contracts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export default function CreateBet() {
  const { toast } = useToast()
  const { account } = useWallet()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    expiration: "",
    resolver: "0x..." // Default resolver address
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a bet",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

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

      // Convert amount to wei
      const amountInWei = ethers.parseEther(formData.amount)
      
      // Convert expiration date to timestamp
      const expiryTimestamp = Math.floor(new Date(formData.expiration).getTime() / 1000)

      // Call the smart contract
      const tx = await contract.createBet(
        DESTINATION_CHAIN_ID, // destinationChainId from contracts.ts
        formData.description,
        expiryTimestamp,
        formData.resolver,
        { value: amountInWei }
      )

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      toast({
        title: "Bet created successfully",
        description: "Your bet has been published to the blockchain",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        amount: "",
        expiration: "",
        resolver: "0x..."
      })

      // Redirect to dashboard
      router.push("/dashboard")

    } catch (error: any) {
      console.error("Error creating bet:", error)
      toast({
        title: "Error creating bet",
        description: error.message || "Failed to create bet",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/explore">
            Explore
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Create a New Bet</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bet Details</CardTitle>
              <CardDescription>
                Specify the terms of your bet. Once created, it will be published to the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Bet Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Bitcoin will reach $100K" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide clear, specific details about the conditions of the bet"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Stake Amount (ETH)</Label>
                    <div className="flex">
                      <Input 
                        id="amount" 
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        type="number" 
                        min="0.01" 
                        step="0.01" 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiration">Expiration Date</Label>
                    <div className="relative">
                      <Input 
                        id="expiration" 
                        name="expiration"
                        value={formData.expiration}
                        onChange={handleInputChange}
                        type="date" 
                        min="2025-01-01" 
                        required 
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resolver">Resolver Address</Label>
                  <Input 
                    id="resolver" 
                    name="resolver"
                    value={formData.resolver}
                    onChange={handleInputChange}
                    placeholder="0x..." 
                    required 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This address will be responsible for resolving the bet outcome.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Platform Fee:</div>
                    <div className="text-right">2.5%</div>
                    <div>Gas Estimate:</div>
                    <div className="text-right">~0.002 ETH</div>
                  </div>
                </div>

                <CardFooter className="px-0 pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Bet..." : "Create Bet"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
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
