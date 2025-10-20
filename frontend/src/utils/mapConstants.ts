export const flagIcons = {
  compliant: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#10b981" rx="16"/>
      <path d="M12 16L14 18L20 12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `)}`,
  pending: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#f59e0b" rx="16"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">?</text>
    </svg>
  `)}`,
  noncompliant: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#ef4444" rx="16"/>
      <path d="M12 12L20 20M20 12L12 20" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `)}`
};