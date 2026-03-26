/** Dusky Seaside Sparrow — chorale notation SVG extracted from original HTML card */
export default function DuskySparrowNotation() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="2 7 30 11" className="max-w-[520px]" aria-label="Musical notation: chorale for Dusky Seaside Sparrow">
      {/* Staff lines */}
      <g transform="translate(5.6906, 13.8067)"><line strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.1000" stroke="currentColor" x1="0.0500" y1="0" x2="15.7781" y2="0"/></g>
      <g transform="translate(5.6906, 12.8067)"><line strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.1000" stroke="currentColor" x1="0.0500" y1="0" x2="15.7781" y2="0"/></g>
      <g transform="translate(5.6906, 11.8067)"><line strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.1000" stroke="currentColor" x1="0.0500" y1="0" x2="15.7781" y2="0"/></g>
      <g transform="translate(5.6906, 10.8067)"><line strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.1000" stroke="currentColor" x1="0.0500" y1="0" x2="15.7781" y2="0"/></g>
      <g transform="translate(5.6906, 9.8067)"><line strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.1000" stroke="currentColor" x1="0.0500" y1="0" x2="15.7781" y2="0"/></g>
      {/* Ledger line for Bb3 */}
      <g transform="translate(5.6906, 14.8067)"><rect x="9.0950" y="-0.1000" width="2.6275" height="0.2000" ry="0.1000" fill="currentColor"/></g>
      {/* Treble clef */}
      <g transform="translate(6.4906, 12.8067)">
        <path transform="scale(0.0040, -0.0040)" d="M266 -635h-6c-108 0 -195 88 -195 197c0 58 53 103 112 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95c-11 0 -21 2 -31 6c26 -39 68 -65 117 -65h4zM461 -203c68 24 113 90 113 164c0 90 -66 179 -173 190c19 -89 48 -242 60 -354zM74 28c0 -145 141 -247 264 -247c1 0 47 0 82 6c-7 64 -29 203 -63 364c-79 -8 -124 -61 -124 -119c0 -44 25 -91 81 -123c5 -5 7 -10 7 -15c0 -11 -10 -22 -22 -22c-15 0 -126 62 -126 187c0 88 58 174 160 197c-14 58 -29 117 -46 175c-107 -121 -213 -243 -213 -403zM250 553c-29 96 -52 170 -52 346c0 115 55 224 149 292c6 5 14 5 20 0c68 -80 133 -245 133 -358c0 -143 -86 -255 -180 -364c21 -68 39 -138 56 -207c2 0 7 1 13 1c155 0 256 -128 256 -261c0 -113 -74 -212 -180 -246c3 -35 5 -70 5 -105c0 -19 -1 -39 -2 -58c-7 -119 -88 -225 -202 -228l1 43c93 2 153 92 159 191c1 18 2 37 2 55c0 31 -1 61 -4 92c-5 -1 -44 -8 -89 -8c-193 0 -333 180 -333 374c0 177 131 306 248 441zM428 916c0 34 1 66 -20 129c-99 -48 -162 -149 -162 -259c0 -52 12 -115 36 -194c80 97 146 198 146 324z" fill="currentColor"/>
      </g>
      {/* Flat sign */}
      <g transform="translate(13.8106, 15.3067)">
        <path transform="scale(0.0040, -0.0040)" d="M27 41l-1 -66v-11c0 -22 1 -44 4 -66c45 38 93 80 93 139c0 33 -14 67 -43 67c-31 0 -52 -30 -53 -63zM-15 -138l-12 595c8 5 18 8 27 8s19 -3 27 -8l-7 -345c25 21 58 34 91 34c52 0 89 -48 89 -102c0 -80 -86 -117 -147 -169c-15 -13 -24 -38 -45 -38c-13 0 -23 11 -23 25z" fill="currentColor"/>
      </g>
      {/* Fermata */}
      <g transform="translate(15.9416, 9.2807)">
        <path transform="scale(0.0040, -0.0040)" d="M-67 48c0 37 30 67 67 67s67 -30 67 -67s-30 -67 -67 -67s-67 30 -67 67zM0 363c255 0 332 -331 332 -366c0 -9 -10 -15 -19 -15s-17 5 -19 18c-26 148 -146 262 -294 262s-268 -114 -294 -262c-2 -13 -10 -18 -19 -18s-19 6 -19 15c0 35 77 366 332 366z" fill="currentColor"/>
      </g>
      {/* Noteheads: D5, A4, E4, Bb3 */}
      {[10.8067, 12.3067, 13.8067, 15.3067].map((y) => (
        <g key={y} transform={`translate(14.9606, ${y})`}>
          <path transform="scale(0.0040, -0.0040)" d="M213 112c-45 0 -69 -34 -69 -88c0 -102 89 -136 134 -136s69 34 69 88c0 102 -89 136 -134 136zM245 136c144 0 246 -65 246 -136s-102 -136 -246 -136s-245 65 -245 136s101 136 245 136z" fill="currentColor"/>
        </g>
      ))}
      {/* Voice leading lines */}
      <line x1="16.8" y1="15.3" x2="30" y2="16.5" stroke="currentColor" strokeWidth="0.08" opacity="0.4"/>
      <line x1="16.8" y1="13.8" x2="30" y2="14.2" stroke="currentColor" strokeWidth="0.08" opacity="0.4"/>
      <line x1="16.8" y1="12.3" x2="30" y2="11.8" stroke="currentColor" strokeWidth="0.08" opacity="0.4"/>
      <line x1="16.8" y1="10.8" x2="30" y2="9.5" stroke="currentColor" strokeWidth="0.08" opacity="0.4"/>
      {/* Label */}
      <text x="15.5" y="17.5" textAnchor="middle" fontFamily="'EB Garamond', serif" fontSize="1.2" fontStyle="italic" fill="currentColor" opacity="0.6">chorale</text>
    </svg>
  );
}
