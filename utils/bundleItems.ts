import type { FeeData } from '~/composables/useFeeData'

interface BundleMetadata {
  name: string
  icon?: string
  description?: string
}

export function bundleItems(
  data: FeeData[],
  bundles: Record<string, BundleMetadata>
): FeeData[] {
  const _data = [...data]

  for (let i = 0; i < _data.length; i += 1) {
    const item = _data[i] as FeeData & { bundle?: string }

    if (item.bundle) {
      const bundleItems: FeeData[] = [item]

      for (let j = i + 1; j < _data.length; j += 1) {
        const otherItem = _data[j] as FeeData & { bundle?: string }
        if (otherItem.bundle === item.bundle) {
          bundleItems.push(otherItem)
        }
      }

      if (bundleItems.length > 1) {
        const bundleMetadata = bundles[item.bundle as string]
        let result = 0

        for (const bundleItem of bundleItems) {
          _data.splice(_data.indexOf(bundleItem), 1)
          result += bundleItem.results.feeTransferEth || 0
        }

        _data.push({
          metadata: bundleMetadata,
          id: item.bundle,
          results: { feeTransferEth: result },
          children: bundleItems,
        })

        i -= 1 // To compensate for the first item removed
      }
    }
  }

  return _data
}
