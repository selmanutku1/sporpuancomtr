<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <!-- Blue Primary Gradient -->
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>

    <!-- Gold Accent Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>

    <!-- Glowing Effect -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="25" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Subtle Stadium Grid Pattern Lines -->
  <path d="M 0 150 L 1200 150 M 0 300 L 1200 300 M 0 450 L 1200 450" stroke="#334155" stroke-width="1" opacity="0.3"/>
  <path d="M 300 0 L 300 630 M 600 0 L 600 630 M 900 0 L 900 630" stroke="#334155" stroke-width="1" opacity="0.3"/>

  <!-- Decorative Glowing Orbs -->
  <circle cx="200" cy="180" r="180" fill="#2563eb" opacity="0.18" filter="url(#glow)"/>
  <circle cx="1000" cy="450" r="220" fill="#1d4ed8" opacity="0.15" filter="url(#glow)"/>

  <!-- Main Card Container Frame -->
  <rect x="80" y="60" width="1040" height="510" rx="32" fill="#1e293b" fill-opacity="0.6" stroke="#334155" stroke-width="2"/>

  <!-- SporPuan Shield Logo Badge -->
  <g transform="translate(140, 155)">
    <!-- Shield Outer Shadow Glow -->
    <rect x="-10" y="-10" width="180" height="180" rx="40" fill="#2563eb" opacity="0.3" filter="url(#glow)"/>
    
    <!-- Shield Container -->
    <rect width="160" height="160" rx="36" fill="url(#blueGrad)" />
    
    <!-- Shield Inner Contour -->
    <path d="M80 30 C100 30, 120 25, 125 20 C125 75, 110 120, 80 140 C50 120, 35 75, 35 20 C40 25, 60 30, 80 30 Z" 
          fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round" opacity="0.4"/>
    
    <!-- Gold Star Center -->
    <polygon points="80,48 89,70 112,71 95,86 100,109 80,96 60,109 65,86 48,71 71,70" fill="url(#goldGrad)"/>
  </g>

  <!-- Typography Brand Title -->
  <text x="340" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="84" fill="#ffffff" letter-spacing="-2">
    spor<tspan fill="#3b82f6">puan</tspan>
  </text>

  <!-- Tagline Subtitle -->
  <text x="340" y="295" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="28" fill="#94a3b8">
    Spor Etkinliği Puanlama &amp; İnceleme Platformu
  </text>

  <!-- 5 Gold Stars Rating Badge -->
  <g transform="translate(340, 330)">
    <rect x="0" y="0" width="460" height="42" rx="12" fill="#0f172a" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
    <!-- Stars -->
    <text x="18" y="27" font-family="sans-serif" font-size="20" fill="#fbbf24">★★★★★</text>
    <text x="110" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="15" fill="#f8fafc">
      Türkiye'nin Bağımsız Taraftar Platformu
    </text>
  </g>

  <!-- Key Evaluation Badges -->
  <g transform="translate(140, 440)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="160" height="44" rx="12" fill="#334155" fill-opacity="0.5" stroke="#475569" stroke-width="1"/>
    <text x="80" y="27" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#e2e8f0">🏟️ Stadyum</text>

    <!-- Badge 2 -->
    <rect x="180" y="0" width="160" height="44" rx="12" fill="#334155" fill-opacity="0.5" stroke="#475569" stroke-width="1"/>
    <text x="260" y="27" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#e2e8f0">🔥 Atmosfer</text>

    <!-- Badge 3 -->
    <rect x="360" y="0" width="160" height="44" rx="12" fill="#334155" fill-opacity="0.5" stroke="#475569" stroke-width="1"/>
    <text x="440" y="27" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#e2e8f0">🎫 Bilet &amp; Fiyat</text>

    <!-- Badge 4 -->
    <rect x="540" y="0" width="160" height="44" rx="12" fill="#334155" fill-opacity="0.5" stroke="#475569" stroke-width="1"/>
    <text x="620" y="27" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#e2e8f0">🚌 Ulaşım</text>

    <!-- Badge 5 -->
    <rect x="720" y="0" width="200" height="44" rx="12" fill="#1e40af" fill-opacity="0.6" stroke="#3b82f6" stroke-width="1"/>
    <text x="820" y="27" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="15" fill="#60a5fa">✨ Sporpuan AI</text>
  </g>

  <!-- URL watermark -->
  <text x="1080" y="530" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#64748b" letter-spacing="1">
    SPORPUAN.COM
  </text>
</svg>
