export interface FeeData {
  id: string
  metadata: {
    name: string
    shortName?: string
    subtitle?: string
    icon?: string
    description?: string
    website?: string
    l2BeatSlug?: string
    category?: string
    flags?: Record<string, string>
    flagsByQuery?: Record<string, Record<string, string>>
  }
  results: {
    feeTransferEth?: number
    feeTransferERC20?: number
    feeTransferToken?: number
    feeSwap?: number
  }
  offchainDA?: boolean
  children?: FeeData[]
}

export async function useFeeData() {
  const { data, error, status } = await useAsyncData<FeeData[]>(
    'fee-data',
    () => $fetch<FeeData[]>('/api/fees'),
    {
      server: true,
      lazy: false,
    }
  )

  return {
    data,
    error,
    loading: status.value === 'pending',
  }
}
