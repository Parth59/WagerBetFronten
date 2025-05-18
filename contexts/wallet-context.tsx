"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatAddress, getNetworkName } from "@/lib/web3-utils"

// Define types for MetaMask's ethereum provider
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      selectedAddress: string | null
      chainId?: string
      isConnected?: () => boolean
    }
  }
}

interface WalletContextType {
  account: string | null
  balance: string
  isConnecting: boolean
  isDisconnecting: boolean
  isMetaMaskInstalled: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  lockedInBets: string
  totalWinnings: string
  formatAddress: (address: string) => string
  networkName: string
  chainId: string | null
  refreshWalletState: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [lockedInBets, setLockedInBets] = useState<string>("0")
  const [totalWinnings, setTotalWinnings] = useState<string>("0")
  const [chainId, setChainId] = useState<string | null>(null)
  const [networkName, setNetworkName] = useState<string>("Not Connected")
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0)

  // Use refs to track the previous state for comparison
  const prevAccountRef = useRef<string | null>(null)
  const prevChainIdRef = useRef<string | null>(null)

  const { toast } = useToast()

  // Fetch wallet balance
  const fetchBalance = useCallback(async (walletAddress: string) => {
    if (!walletAddress || !window.ethereum) return

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      })

      // Convert from wei to ether
      const etherBalance = Number.parseInt(balance, 16) / 1e18
      setBalance(etherBalance.toFixed(4))

      // In a real app, these would come from smart contracts
      // For demo purposes, we'll simulate these values
      simulateBetData(walletAddress)
    } catch (error) {
      console.error("Error fetching balance:", error)
      setBalance("0")
    }
  }, [])

  // Simulate bet data based on the account address
  const simulateBetData = useCallback((address: string) => {
    // Use the last 4 digits of the address to generate consistent but random-looking values
    const seed = Number.parseInt(address.slice(-4), 16)

    // Generate values between 0.1 and 2.5 ETH for locked bets
    const lockedValue = (0.1 + (seed % 24) / 10).toFixed(2)
    setLockedInBets(lockedValue)

    // Generate values between 0.2 and 3.0 ETH for winnings
    const winningsValue = (0.2 + (seed % 28) / 10).toFixed(2)
    setTotalWinnings(winningsValue)
  }, [])

  // Update network information
  const updateNetworkInfo = useCallback(async () => {
    if (!window.ethereum) return

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // Only update if changed
      if (chainId !== prevChainIdRef.current) {
        setChainId(chainId)
        setNetworkName(getNetworkName(chainId))
        prevChainIdRef.current = chainId
      }
    } catch (error) {
      console.error("Error getting network info:", error)
      setChainId(null)
      setNetworkName("Unknown Network")
      prevChainIdRef.current = null
    }
  }, [])

  // Reset all wallet state
  const resetWalletState = useCallback(() => {
    setAccount(null)
    setBalance("0")
    setLockedInBets("0")
    setTotalWinnings("0")
    prevAccountRef.current = null
  }, [])

  // Check if MetaMask is still connected and get current accounts
  const checkWalletConnection = useCallback(async () => {
    if (!window.ethereum) {
      if (account) {
        // MetaMask was removed or disabled
        resetWalletState()
        toast({
          title: "Wallet disconnected",
          description: "MetaMask is no longer available",
        })
      }
      return
    }

    try {
      // Get current accounts
      const accounts = await window.ethereum.request({ method: "eth_accounts" })

      if (accounts.length === 0) {
        // No accounts - user is logged out or disconnected
        if (account) {
          resetWalletState()
          toast({
            title: "Wallet disconnected",
            description: "No accounts found in MetaMask",
          })
        }
      } else if (accounts[0] !== account) {
        // Account changed - could be a different wallet or just a different account
        const newAccount = accounts[0]
        setAccount(newAccount)
        fetchBalance(newAccount)

        // Only show toast if we had an account before (not on initial load)
        if (account) {
          toast({
            title: "Wallet changed",
            description: `Connected to ${formatAddress(newAccount)}`,
          })
        }
      }

      // Update previous account reference
      prevAccountRef.current = accounts.length > 0 ? accounts[0] : null

      // Always update network info when checking connection
      await updateNetworkInfo()
    } catch (error) {
      console.error("Error checking wallet connection:", error)
      // If we can't check accounts, assume disconnected
      if (account) {
        resetWalletState()
      }
    }
  }, [account, fetchBalance, resetWalletState, toast, updateNetworkInfo])

  // Initialize wallet connection
  const initializeWallet = useCallback(async () => {
    const { ethereum } = window
    if (ethereum && ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true)
      await checkWalletConnection()
    } else {
      setIsMetaMaskInstalled(false)
    }
  }, [checkWalletConnection])

  // Public method to refresh wallet state
  const refreshWalletState = useCallback(async () => {
    await checkWalletConnection()
    setLastRefreshTime(Date.now())
  }, [checkWalletConnection])

  // Check if MetaMask is installed on initial load
  useEffect(() => {
    initializeWallet()
  }, [initializeWallet])

  // Periodically check wallet connection status
  useEffect(() => {
    // Check every 5 seconds for wallet changes
    const intervalId = setInterval(() => {
      checkWalletConnection()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [checkWalletConnection])

  // Handle account changes
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        resetWalletState()
        toast({
          title: "Wallet disconnected",
          description: "Your wallet has been disconnected",
        })
      } else if (accounts[0] !== prevAccountRef.current) {
        // User switched accounts
        const newAccount = accounts[0]
        setAccount(newAccount)
        fetchBalance(newAccount)
        prevAccountRef.current = newAccount
        toast({
          title: "Account changed",
          description: `Switched to ${formatAddress(newAccount)}`,
        })
      }
    },
    [fetchBalance, resetWalletState, toast],
  )

  // Handle chain/network changes
  const handleChainChanged = useCallback(
    (newChainId: string) => {
      if (newChainId !== prevChainIdRef.current) {
        setChainId(newChainId)
        const newNetworkName = getNetworkName(newChainId)
        setNetworkName(newNetworkName)
        prevChainIdRef.current = newChainId

        // Refresh balance when network changes
        if (account) {
          fetchBalance(account)
        }

        toast({
          title: "Network changed",
          description: `Switched to ${newNetworkName}`,
        })
      }
    },
    [account, fetchBalance, toast],
  )

  // Handle disconnect event
  const handleDisconnect = useCallback(
    (error: { code: number; message: string }) => {
      console.log("MetaMask disconnect event:", error)
      resetWalletState()
      toast({
        title: "Wallet disconnected",
        description: "Your connection to MetaMask was terminated",
      })
    },
    [resetWalletState, toast],
  )

  // Set up event listeners for MetaMask
  useEffect(() => {
    if (window.ethereum) {
      // Set up event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)
    }

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect])

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // Update network info
      await updateNetworkInfo()

      // Set account and fetch balance
      const newAccount = accounts[0]
      setAccount(newAccount)
      prevAccountRef.current = newAccount
      fetchBalance(newAccount)

      toast({
        title: "Wallet connected",
        description: `Connected to ${formatAddress(newAccount)}`,
      })
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = async () => {
    setIsDisconnecting(true)

    try {
      // MetaMask doesn't provide a direct method to disconnect
      // But we can clear permissions which will force a reconnect next time
      if (window.ethereum) {
        try {
          // This is an experimental method that might work in some versions of MetaMask
          // It's not standard, but worth trying
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          })
        } catch (permissionError) {
          // If the method is not available, we'll just ignore it
          console.log("Permission revocation not supported:", permissionError)
        }
      }

      // Clear our local state regardless of whether the above worked
      resetWalletState()

      // Clear any stored connection data
      localStorage.removeItem("walletConnected")

      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected from this site",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnection issue",
        description: "There was an issue disconnecting your wallet, but we've cleared the local connection.",
      })

      // Still reset state even if there was an error
      resetWalletState()
    } finally {
      setIsDisconnecting(false)
    }

    return Promise.resolve()
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        isConnecting,
        isDisconnecting,
        isMetaMaskInstalled,
        connectWallet,
        disconnectWallet,
        lockedInBets,
        totalWinnings,
        formatAddress,
        networkName,
        chainId,
        refreshWalletState,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
