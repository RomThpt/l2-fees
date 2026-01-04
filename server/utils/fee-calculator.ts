import { ethers } from 'ethers'
import type { L2Chain } from './l2-chains'

// Gas units for different transaction types
const GAS_UNITS = {
  ethTransfer: 21000,
  erc20Transfer: 65000, // Approximate
  swap: 150000, // Approximate for a typical swap
}

export interface FeeResult {
  feeTransferEth?: number
  feeTransferERC20?: number
  feeSwap?: number
  gasPrice?: number // in Gwei
  error?: string
}

// Cache ETH price
let ethPriceCache: { price: number; timestamp: number } | null = null
const ETH_PRICE_CACHE_TTL = 60 * 1000 // 1 minute

async function getEthPrice(): Promise<number> {
  const now = Date.now()
  if (ethPriceCache && now - ethPriceCache.timestamp < ETH_PRICE_CACHE_TTL) {
    return ethPriceCache.price
  }

  try {
    // Use CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )
    const data = await response.json()
    const price = data.ethereum?.usd || 3000 // Fallback price
    ethPriceCache = { price, timestamp: now }
    return price
  } catch (error) {
    console.error('Failed to fetch ETH price:', error)
    return ethPriceCache?.price || 3000 // Use cached or fallback
  }
}

export async function getChainFees(chain: L2Chain): Promise<FeeResult> {
  // Skip Starknet for now - requires different approach
  if (chain.id === 'starknet') {
    return {
      feeTransferEth: undefined,
      feeTransferERC20: undefined,
      feeSwap: undefined,
      error: 'Starknet requires special handling',
    }
  }

  try {
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl, chain.chainId)

    // Get fee data
    const feeData = await provider.getFeeData()

    // Get gas price in wei
    let gasPriceWei: bigint
    if (feeData.maxFeePerGas) {
      // EIP-1559 chain
      gasPriceWei = feeData.maxFeePerGas
    } else if (feeData.gasPrice) {
      // Legacy chain
      gasPriceWei = feeData.gasPrice
    } else {
      throw new Error('Could not get gas price')
    }

    // Get ETH price
    const ethPrice = await getEthPrice()

    // Calculate fees in USD
    const gasPriceGwei = Number(gasPriceWei) / 1e9

    const calculateFeeUSD = (gasUnits: number): number => {
      const feeWei = gasPriceWei * BigInt(gasUnits)
      const feeEth = Number(feeWei) / 1e18
      return feeEth * ethPrice
    }

    return {
      feeTransferEth: calculateFeeUSD(GAS_UNITS.ethTransfer),
      feeTransferERC20: calculateFeeUSD(GAS_UNITS.erc20Transfer),
      feeSwap: calculateFeeUSD(GAS_UNITS.swap),
      gasPrice: gasPriceGwei,
    }
  } catch (error: any) {
    console.error(`Error fetching fees for ${chain.name}:`, error.message)
    return {
      feeTransferEth: undefined,
      feeTransferERC20: undefined,
      feeSwap: undefined,
      error: error.message,
    }
  }
}

export async function getAllChainFees(
  chains: L2Chain[]
): Promise<Map<string, FeeResult>> {
  const results = new Map<string, FeeResult>()

  // Fetch all chain fees in parallel
  const promises = chains.map(async (chain) => {
    const fees = await getChainFees(chain)
    results.set(chain.id, fees)
  })

  await Promise.all(promises)
  return results
}
