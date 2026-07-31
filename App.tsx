<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Rounded Background Container -->
  <rect width="512" height="512" rx="120" fill="url(#logoBlueGrad)" filter="url(#logoShadow)"/>

  <!-- Shield Outline Contour -->
  <path d="M256 100 C320 100, 380 80, 400 64 C400 250, 350 390, 256 450 C162 390, 112 250, 112 64 C132 80, 192 100, 256 100 Z" 
        fill="none" stroke="#ffffff" stroke-width="24" stroke-linejoin="round" opacity="0.35"/>

  <!-- Center Gold Star Icon -->
  <polygon points="256,150 286,220 360,225 304,272 322,345 256,305 190,345 208,272 152,225 226,220" fill="url(#logoGoldGrad)"/>
</svg>
