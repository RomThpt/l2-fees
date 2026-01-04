import { L2_CHAINS } from '../utils/l2-chains'
import { getAllChainFees } from '../utils/fee-calculator'
import type { FeeData } from '~/composables/useFeeData'

let cachedData: FeeData[] | null = null
let cacheTime = 0
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export default defineEventHandler(async () => {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedData && now - cacheTime < CACHE_TTL) {
    return cachedData
  }

  try {
    // Fetch fees from all chains via RPC
    const feesMap = await getAllChainFees(L2_CHAINS)

    // Transform to FeeData format
    const data: FeeData[] = L2_CHAINS.map((chain) => {
      const fees = feesMap.get(chain.id)

      return {
        id: chain.id,
        metadata: {
          name: chain.name,
          shortName: chain.shortName,
          website: chain.website,
          l2BeatSlug: chain.l2BeatSlug,
          category: chain.category,
        },
        results: {
          feeTransferEth: fees?.feeTransferEth,
          feeTransferERC20: fees?.feeTransferERC20,
          feeTransferToken: fees?.feeTransferERC20, // Alias
          feeSwap: fees?.feeSwap,
        },
        offchainDA: !chain.isFullRollup,
      }
    })

    // Update cache
    cachedData = data
    cacheTime = now

    return data
  } catch (error: any) {
    console.error('Error fetching fee data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch fee data',
      message: error.message,
    })
  }
})
