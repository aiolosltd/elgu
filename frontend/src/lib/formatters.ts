// Weather Summary Timestamp Formatter

export function formatTimestamp(): string {
  const now = new Date();
  return (
    now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' - ' +
    now
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      .toLowerCase()
  );
}


/**
 * Format numbers with commas for display
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'PHP'): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};