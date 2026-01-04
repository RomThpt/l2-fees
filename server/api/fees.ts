import { CryptoStatsSDK } from '@cryptostats/sdk'

let cachedData: any = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const now = Date.now()

  // Return cached data if still valid
  if (cachedData && now - cacheTime < CACHE_TTL) {
    return cachedData
  }

  try {
    const sdk = new CryptoStatsSDK({
      etherscanKey: config.etherscanKey,
      mongoConnectionString: config.mongoConnectionString,
      redisConnectionString: config.redisUrl,
      executionTimeout: config.executionTimeout ? parseInt(config.executionTimeout as string) : 60,
    })

    // Add RPC providers
    sdk.ethers.addProvider('arbitrum-one', 'https://arb1.arbitrum.io/rpc')
    sdk.ethers.addProvider('optimism', 'https://mainnet.optimism.io')

    const collection = sdk.getCollection('l2-fees')
    const l1Adapters = sdk.getCollection('l1-fees')

    await collection.fetchAdapters()
    await l1Adapters.fetchAdapters()

    const ethAdapter = l1Adapters.getAdapter('ethereum')
    if (ethAdapter) {
      collection.addAdapter(ethAdapter)
    }

    const data = await collection.executeQueriesWithMetadata(
      ['feeTransferEth', 'feeTransferERC20', 'feeTransferToken', 'feeSwap'],
      { allowMissingQuery: true }
    )

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
