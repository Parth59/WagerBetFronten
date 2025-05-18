"use client"

import { Loader2, RefreshCw, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { NetworkIndicator } from "@/components/network-indicator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletConnect() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const {
    account,
    isConnecting,
    isDisconnecting,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    formatAddress,
    refreshWalletState,
  } = useWallet()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshWalletState()
    setTimeout(() => setIsRefreshing(false), 500) // Minimum visual feedback time
  }

  const handleDisconnect = async () => {
    await disconnectWallet()
  }

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh wallet connection</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh wallet connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="outline" onClick={handleDisconnect} className="flex items-center" disabled={isDisconnecting}>
          {isDisconnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
          <span>{formatAddress(account)}</span>
          <NetworkIndicator />
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect your wallet to create and take bets on our platform.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => {
              connectWallet()
              setDialogOpen(false)
            }}
            className="w-full justify-start"
            disabled={isConnecting || !isMetaMaskInstalled}
          >
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <img src="/placeholder.svg?height=24&width=24" alt="MetaMask" className="mr-2 h-6 w-6" />
            )}
            {isConnecting ? "Connecting..." : "MetaMask"}
            {!isMetaMaskInstalled && " (Not Installed)"}
          </Button>
          <Button className="w-full justify-start" disabled>
            <img src="/placeholder.svg?height=24&width=24" alt="WalletConnect" className="mr-2 h-6 w-6" />
            WalletConnect (Coming Soon)
          </Button>
          <Button className="w-full justify-start" disabled>
            <img src="/placeholder.svg?height=24&width=24" alt="Coinbase Wallet" className="mr-2 h-6 w-6" />
            Coinbase Wallet (Coming Soon)
          </Button>
        </div>
        {!isMetaMaskInstalled && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p>
              MetaMask is not installed.{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Click here
              </a>{" "}
              to install it.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
