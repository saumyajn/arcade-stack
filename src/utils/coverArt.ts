const palette = {
  bg: '#111827',
  panel: '#1f2937',
  violet: '#8b5cf6',
  cyan: '#2dd4bf',
  amber: '#fbbf24',
  rose: '#fb7185',
  text: '#f8fafc',
  muted: '#94a3b8',
};

const svg = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${palette.bg}"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="640" height="400" rx="28" fill="url(#bg)"/>
    <path d="M0 320 C120 270 210 350 330 300 C430 260 520 280 640 230 L640 400 L0 400Z" fill="${palette.violet}" opacity="0.12"/>
    <path d="M0 70 C150 25 250 85 390 45 C500 15 565 45 640 20" fill="none" stroke="${palette.cyan}" opacity="0.22" stroke-width="7"/>
    ${body}
  </svg>`)}
`;

export const coverArt = {
  'rock-paper-scissors': svg(`
    <circle cx="180" cy="190" r="72" fill="${palette.panel}" filter="url(#shadow)"/>
    <circle cx="320" cy="165" r="72" fill="${palette.panel}" filter="url(#shadow)"/>
    <circle cx="460" cy="190" r="72" fill="${palette.panel}" filter="url(#shadow)"/>
    <text x="180" y="205" text-anchor="middle" font-size="58" font-family="Arial" font-weight="800" fill="${palette.rose}">R</text>
    <text x="320" y="182" text-anchor="middle" font-size="58" font-family="Arial" font-weight="800" fill="${palette.cyan}">P</text>
    <text x="460" y="205" text-anchor="middle" font-size="58" font-family="Arial" font-weight="800" fill="${palette.amber}">S</text>
    <text x="320" y="320" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">BOT DUEL</text>
  `),
  battleship: svg(`
    <rect x="135" y="96" width="370" height="220" rx="18" fill="${palette.panel}" filter="url(#shadow)"/>
    ${Array.from({ length: 8 }).map((_, i) => `<line x1="${155 + i * 45}" y1="116" x2="${155 + i * 45}" y2="296" stroke="${palette.muted}" opacity="0.25"/>`).join('')}
    ${Array.from({ length: 5 }).map((_, i) => `<line x1="155" y1="${116 + i * 45}" x2="470" y2="${116 + i * 45}" stroke="${palette.muted}" opacity="0.25"/>`).join('')}
    <rect x="205" y="165" width="130" height="36" rx="18" fill="${palette.cyan}"/>
    <rect x="350" y="230" width="85" height="36" rx="18" fill="${palette.rose}"/>
    <circle cx="405" cy="150" r="18" fill="${palette.amber}"/>
    <text x="320" y="354" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">BATTLE GRID</text>
  `),
  'word-scramble': svg(`
    <rect x="110" y="100" width="420" height="200" rx="22" fill="${palette.panel}" filter="url(#shadow)"/>
    ${['W', 'O', 'R', 'D'].map((letter, i) => `<rect x="${155 + i * 85}" y="145" width="64" height="64" rx="14" fill="${[palette.violet, palette.cyan, palette.amber, palette.rose][i]}"/><text x="${187 + i * 85}" y="188" text-anchor="middle" font-size="36" font-family="Arial" font-weight="900" fill="${palette.bg}">${letter}</text>`).join('')}
    <text x="320" y="252" text-anchor="middle" font-size="26" font-family="Arial" font-weight="800" fill="${palette.text}">UNSCRAMBLE</text>
  `),
  'treasure-island': svg(`
    <path d="M180 270 C230 135 405 135 460 270Z" fill="${palette.amber}" opacity="0.88" filter="url(#shadow)"/>
    <path d="M250 265 C275 210 340 205 370 265Z" fill="${palette.bg}" opacity="0.45"/>
    <rect x="300" y="95" width="36" height="175" fill="${palette.panel}"/>
    <path d="M336 108 L460 145 L336 182Z" fill="${palette.rose}"/>
    <path d="M110 300 C230 260 390 340 530 290" fill="none" stroke="${palette.cyan}" stroke-width="12" opacity="0.5"/>
    <text x="320" y="354" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">PYTHON QUEST</text>
  `),
  hangman: svg(`
    <rect x="135" y="92" width="370" height="220" rx="22" fill="${palette.panel}" filter="url(#shadow)"/>
    <path d="M250 275 V130 H390 V160" fill="none" stroke="${palette.cyan}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="390" cy="185" r="28" fill="none" stroke="${palette.amber}" stroke-width="10"/>
    <path d="M390 214 V260 M350 235 H430 M390 260 L360 292 M390 260 L420 292" fill="none" stroke="${palette.amber}" stroke-width="10" stroke-linecap="round"/>
    <text x="320" y="350" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">WORD SURVIVAL</text>
  `),
  'tic-tac-toe': svg(`
    <rect x="180" y="80" width="280" height="280" rx="24" fill="${palette.panel}" filter="url(#shadow)"/>
    <line x1="273" y1="105" x2="273" y2="335" stroke="${palette.muted}" stroke-width="8"/>
    <line x1="367" y1="105" x2="367" y2="335" stroke="${palette.muted}" stroke-width="8"/>
    <line x1="205" y1="173" x2="435" y2="173" stroke="${palette.muted}" stroke-width="8"/>
    <line x1="205" y1="267" x2="435" y2="267" stroke="${palette.muted}" stroke-width="8"/>
    <text x="228" y="152" font-size="58" font-family="Arial" font-weight="900" fill="${palette.violet}">X</text>
    <text x="320" y="248" text-anchor="middle" font-size="58" font-family="Arial" font-weight="900" fill="${palette.cyan}">O</text>
    <text x="414" y="340" text-anchor="middle" font-size="58" font-family="Arial" font-weight="900" fill="${palette.violet}">X</text>
  `),
  'memory-match': svg(`
    ${Array.from({ length: 8 }).map((_, i) => `<rect x="${125 + (i % 4) * 95}" y="${92 + Math.floor(i / 4) * 105}" width="72" height="86" rx="14" fill="${i % 3 === 0 ? palette.violet : i % 3 === 1 ? palette.cyan : palette.amber}" opacity="${i < 2 ? 0.95 : 0.42}" filter="url(#shadow)"/>`).join('')}
    <text x="320" y="335" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">MATCH PAIRS</text>
  `),
  'number-guess': svg(`
    <rect x="150" y="90" width="340" height="220" rx="24" fill="${palette.panel}" filter="url(#shadow)"/>
    <text x="320" y="205" text-anchor="middle" font-size="96" font-family="Arial" font-weight="900" fill="${palette.amber}">?</text>
    <text x="320" y="260" text-anchor="middle" font-size="24" font-family="Arial" font-weight="800" fill="${palette.cyan}">1 - 100</text>
    <text x="320" y="350" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">BOT NUMBER</text>
  `),
  'context-climb': svg(`
    <rect x="100" y="105" width="240" height="80" rx="18" fill="${palette.panel}" filter="url(#shadow)"/>
    <rect x="300" y="215" width="240" height="80" rx="18" fill="${palette.panel}" filter="url(#shadow)"/>
    <path d="M245 185 C300 240 305 155 365 215" fill="none" stroke="${palette.cyan}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="490" cy="132" r="36" fill="${palette.amber}" opacity="0.92"/>
    <text x="220" y="155" text-anchor="middle" font-size="34" font-family="Arial" font-weight="900" fill="${palette.text}">#18</text>
    <text x="420" y="265" text-anchor="middle" font-size="34" font-family="Arial" font-weight="900" fill="${palette.amber}">#1</text>
    <text x="320" y="348" text-anchor="middle" font-size="30" font-family="Arial" font-weight="800" fill="${palette.text}">CONTEXT CLIMB</text>
  `),
};
