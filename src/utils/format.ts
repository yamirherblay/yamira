export function formatPrice(value: number, currency?: string | null): string {
  const c = currency || 'CUP';
  const formatted = new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: c,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
  }).format(value);
  return c !== 'CUP' ? `${formatted} ${c}` : formatted;
}