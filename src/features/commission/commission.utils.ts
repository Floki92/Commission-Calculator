export function formatPercentage(value: number | null): string {
  if (value === null) return '—';
  return value.toFixed(2) + '%';
}

export function formatCurrency(value: number | null): string {
  if (value === null) return '';
  return new Intl.NumberFormat('en-US').format(value) + ' EGP';
}

export function formatNumber(value: number | null): string {
  if (value === null) return '';
  return new Intl.NumberFormat('en-US').format(value);
}

export function parseNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}
