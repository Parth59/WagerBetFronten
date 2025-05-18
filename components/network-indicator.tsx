import { useWallet } from "@/contexts/wallet-context"
import { Badge } from "@/components/ui/badge"

export function NetworkIndicator() {
  const { networkName, chainId } = useWallet()

  if (!chainId) {
    return null
  }

  // Determine badge color based on network
  let variant: "default" | "secondary" | "outline" | "destructive" = "outline"

  if (chainId === "0x1") {
    // Ethereum Mainnet
    variant = "default"
  } else if (chainId === "0x89") {
    // Polygon
    variant = "secondary"
  } else if (chainId === "0x38") {
    // BSC
    variant = "secondary"
  } else if (chainId.startsWith("0x")) {
    // Test networks and others
    variant = "outline"
  }

  return (
    <Badge variant={variant} className="ml-2">
      {networkName}
    </Badge>
  )
}
