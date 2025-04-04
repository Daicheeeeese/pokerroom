export function formatPricePerHour(price: number | null): string {
  if (price === null) return '0'
  return price.toLocaleString()
} 