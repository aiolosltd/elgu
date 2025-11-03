export const flagIcons = {
  compliant: `data:image/svg+xml;base64,${btoa(`
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
  <rect x="28" y="18" width="12" height="800" rx="3" fill="#111" />
  <circle cx="34" cy="12" r="10" fill="#111" />
  <polygon points="40,30 160,70 40,110" fill="#2EB82E"/>
</svg>
  `)}`,
  pending: `data:image/svg+xml;base64,${btoa(`
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
  <rect x="28" y="18" width="12" height="800" rx="3" fill="#111" />
  <circle cx="34" cy="12" r="10" fill="#111" />
  <polygon points="40,30 160,70 40,110" fill="#f59e0b"/>
</svg>

  `)}`,
  noncompliant: `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
  <rect x="28" y="18" width="12" height="800" rx="3" fill="#111" />
  <circle cx="34" cy="12" r="10" fill="#111" />
  <polygon points="40,30 160,70 40,110" fill="#FF0000"/>
</svg>

  `)}`
};


