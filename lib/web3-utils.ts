// Helper functions for web3 interactions

/**
 * Formats an Ethereum address for display
 * @param address The full Ethereum address
 * @returns Shortened address (e.g., 0x71C...8F3e)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Converts Wei to Ether
 * @param wei Amount in Wei (as string or number)
 * @returns Amount in Ether (as string)
 */
export function weiToEther(wei: string | number): string {
  const weiValue = typeof wei === "string" ? wei : wei.toString()
  const etherValue = Number.parseFloat(weiValue) / 1e18
  return etherValue.toFixed(6)
}

/**
 * Converts Ether to Wei
 * @param ether Amount in Ether (as string or number)
 * @returns Amount in Wei (as string)
 */
export function etherToWei(ether: string | number): string {
  const etherValue = typeof ether === "string" ? Number.parseFloat(ether) : ether
  const weiValue = etherValue * 1e18
  return weiValue.toString()
}

/**
 * Checks if MetaMask is installed
 * @returns Boolean indicating if MetaMask is available
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask === true
}

/**
 * Gets the current Ethereum network name
 * @param chainId The chain ID from MetaMask
 * @returns Network name (e.g., "Ethereum Mainnet", "Goerli Testnet")
 */
export function getNetworkName(chainId: string): string {
  const networks: Record<string, string> = {
    "0x1": "Ethereum Mainnet",
    "0x5": "Goerli Testnet",
    "0xaa36a7": "Sepolia Testnet",
    "0x89": "Polygon Mainnet",
    "0x13881": "Mumbai Testnet",
    "0xa": "Optimism Mainnet",
    "0xa4b1": "Arbitrum One",
    "0x38": "BNB Smart Chain",
    "0xa86a": "Avalanche C-Chain",
    "0xfa": "Fantom Opera",
  }

  return networks[chainId] || `Unknown Network (${chainId})`
}
