export function formatUSD(num?: number): string {
  if (!num) return '-'
  if (num < 0.01) return '< $0.01'
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export function formatPercent(num?: number): string {
  if (!num) return '-'
  return num.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  })
}
