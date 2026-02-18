"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────────────

interface GiftShopProduct {
  id: string;
  name: string;
  latinName?: string;
  description: string;
  price: string;
  category: string;
  svgContent: React.ReactNode;
  stockNote?: string;
}

const PRODUCTS: GiftShopProduct[] = [
  // Apparel
  {
    id: "tee-001",
    name: "The Canonical Tee",
    latinName: "Vestis typographica",
    description:
      "A cotton garment featuring all three canonical dashes arranged in descending order of width. The hyphen sits at chest level, suggesting humility. The em dash spans the lower back, suggesting drama.",
    price: "$38.00",
    category: "Apparel",
    svgContent: <TeeShirtSVG />,
    stockNote: "Last purchased by a copy editor in 2019",
  },
  {
    id: "tote-001",
    name: "Tote of Burden",
    latinName: "Sacculus laboris",
    description:
      "A canvas vessel for transporting your typographic anxieties. Features a single, exhausted en dash that has been carrying compound modifiers since 1984.",
    price: "$24.00",
    category: "Apparel",
    svgContent: <ToteBagSVG />,
    stockNote: "Supply chain disrupted by rogue soft hyphens",
  },
  // Stationery
  {
    id: "post-001",
    name: "Postcards from the Void",
    latinName: "Epistula vacua",
    description:
      'A set of 12 postcards, each bearing a different zero-width character. The reverse side reads: "Wish you were here, but technically you already are nowhere."',
    price: "$12.00",
    category: "Stationery",
    svgContent: <PostcardSVG />,
    stockNote: "Inventory status: uncertain (may have dematerialized)",
  },
  {
    id: "note-001",
    name: "The Ruled Notebook",
    latinName: "Codex lineatus",
    description:
      "120 pages of horizontal lines, each one a distant cousin of the dash. The lines do not connect to anything. They simply are. A meditation on parallelism.",
    price: "$18.00",
    category: "Stationery",
    svgContent: <NotebookSVG />,
    stockNote: "All lines have migrated to page 47",
  },
  // Decorative
  {
    id: "print-001",
    name: "Em Dash Specimen Print",
    latinName: "Pictura interruptio",
    description:
      'Archival giclée print of Specimen #c-3 (the em dash) at 400% magnification. Frame not included—the em dash refuses to be contained.',
    price: "$45.00",
    category: "Decorative",
    svgContent: <PrintSVG />,
    stockNote: "The specimen escaped during printing",
  },
  {
    id: "mobile-001",
    name: "Vertical Dash Mobile",
    latinName: "Mobilis verticalem",
    description:
      "A kinetic sculpture featuring rotated dashes suspended at various heights. Some visitors report the dashes slowly returning to horizontal when unobserved.",
    price: "$85.00",
    category: "Decorative",
    svgContent: <MobileSVG />,
    stockNote: "Current position: unknown",
  },
  // Educational
  {
    id: "flash-001",
    name: "Dash Identification Flash Cards",
    latinName: "Chartulae discriminis",
    description:
      "52 cards for distinguishing between visually identical horizontal marks. Includes 8 blank cards representing characters you cannot perceive.",
    price: "$15.00",
    category: "Educational",
    svgContent: <FlashCardsSVG />,
    stockNote: "Cards have shuffled themselves into entropy",
  },
  {
    id: "audio-001",
    name: "Morse Code Meditations (Vinyl)",
    latinName: "Sonitus contemplativus",
    description:
      "Side A: 22 minutes of continuous dashes (—). Side B: Silence representing the spaces between. Pressed on 180g vinyl the exact width of an em dash at 72pt.",
    price: "$32.00",
    category: "Educational",
    svgContent: <VinylSVG />,
    stockNote: "Audio quality degraded by ambient anxiety",
  },
  // Curiosities
  {
    id: "jar-001",
    name: "Jar of Authentic Hyphens",
    latinName: "Amphora divisio",
    description:
      "A sealed glass vessel containing approximately 2,000 recycled hyphens harvested from deprecated compound words. Contents may have settled during existential crisis.",
    price: "$28.00",
    category: "Curiosities",
    svgContent: <JarSVG />,
    stockNote: "Hyphens have dissolved into ligatures",
  },
  {
    id: "snow-001",
    name: "Dash Globe",
    latinName: "Sphaera ninguida",
    description:
      'A traditional snow globe, but instead of snow, tiny black dashes of varying widths fall upon a miniature rendering of this very gift shop. Shake gently. The dashes never fully settle.',
    price: "$42.00",
    category: "Curiosities",
    svgContent: <SnowGlobeSVG />,
    stockNote: "Dashes have formed a union; refusing to fall",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG PRODUCT ILLUSTRATIONS
// ─────────────────────────────────────────────────────────────────────────────

function TeeShirtSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* T-shirt outline */}
      <path
        d="M20 20 L30 15 L35 25 L45 25 L50 15 L60 20 L55 35 L55 65 L25 65 L25 35 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Hyphen */}
      <line x1="36" y1="35" x2="44" y2="35" stroke="currentColor" strokeWidth="2" />
      {/* En dash */}
      <line x1="34" y1="45" x2="46" y2="45" stroke="currentColor" strokeWidth="2" />
      {/* Em dash */}
      <line x1="32" y1="55" x2="48" y2="55" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ToteBagSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Bag body */}
      <rect
        x="20"
        y="30"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Handles */}
      <path d="M28 30 Q28 15 40 15 Q52 15 52 30" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Tired en dash (slightly droopy) */}
      <path d="M30 50 Q40 53 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function PostcardSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Postcard rectangle */}
      <rect
        x="15"
        y="22"
        width="50"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Dividing line */}
      <line x1="40" y1="22" x2="40" y2="58" stroke="currentColor" strokeWidth="0.5" />
      {/* Address lines */}
      <line x1="45" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="1" />
      <line x1="45" y1="42" x2="60" y2="42" stroke="currentColor" strokeWidth="1" />
      <line x1="45" y1="49" x2="60" y2="49" stroke="currentColor" strokeWidth="1" />
      {/* Zero-width space indicator (nothing visible) */}
      <text x="27" y="42" fontSize="6" fill="currentColor" textAnchor="middle">
        [ ]
      </text>
    </svg>
  );
}

function NotebookSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Notebook cover */}
      <rect
        x="22"
        y="15"
        width="36"
        height="50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Spine */}
      <line x1="22" y1="15" x2="22" y2="65" stroke="currentColor" strokeWidth="3" />
      {/* Ruled lines (they are just dashes after all) */}
      {[25, 32, 39, 46, 53].map((y) => (
        <line key={y} x1="28" y1={y} x2="52" y2={y} stroke="currentColor" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function PrintSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Frame */}
      <rect
        x="18"
        y="18"
        width="44"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Inner mat */}
      <rect
        x="24"
        y="24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      {/* Giant em dash specimen */}
      <line x1="28" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}

function MobileSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Hanging rod */}
      <line x1="25" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="1" />
      {/* Strings */}
      <line x1="30" y1="20" x2="30" y2="35" stroke="currentColor" strokeWidth="0.5" />
      <line x1="40" y1="20" x2="40" y2="28" stroke="currentColor" strokeWidth="0.5" />
      <line x1="50" y1="20" x2="50" y2="42" stroke="currentColor" strokeWidth="0.5" />
      {/* Vertical dashes (rotated) */}
      <line x1="30" y1="35" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="28" x2="40" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="42" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function FlashCardsSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Stacked cards */}
      <rect
        x="22"
        y="28"
        width="32"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(-5 38 40)"
      />
      <rect
        x="24"
        y="26"
        width="32"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(3 40 38)"
      />
      <rect
        x="26"
        y="24"
        width="32"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Dash on top card */}
      <line x1="34" y1="36" x2="50" y2="36" stroke="currentColor" strokeWidth="2" />
      {/* Question mark */}
      <text x="42" y="44" fontSize="8" fill="currentColor" textAnchor="middle">
        ?
      </text>
    </svg>
  );
}

function VinylSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Record */}
      <circle cx="40" cy="40" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Center label */}
      <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Center hole */}
      <circle cx="40" cy="40" r="2" fill="currentColor" />
      {/* Grooves represented as dashes */}
      <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 2" />
      <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="6 2" />
      <circle cx="40" cy="40" r="24" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="8 2" />
    </svg>
  );
}

function JarSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Jar body */}
      <path
        d="M28 25 L28 60 Q28 68 40 68 Q52 68 52 60 L52 25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Jar lid */}
      <rect x="26" y="18" width="28" height="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Tiny hyphens floating inside */}
      <line x1="32" y1="35" x2="36" y2="35" stroke="currentColor" strokeWidth="1" />
      <line x1="42" y1="32" x2="46" y2="32" stroke="currentColor" strokeWidth="1" />
      <line x1="35" y1="42" x2="39" y2="42" stroke="currentColor" strokeWidth="1" />
      <line x1="44" y1="45" x2="48" y2="45" stroke="currentColor" strokeWidth="1" />
      <line x1="33" y1="52" x2="37" y2="52" stroke="currentColor" strokeWidth="1" />
      <line x1="41" y1="55" x2="45" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="36" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SnowGlobeSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Globe */}
      <circle cx="40" cy="35" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Base */}
      <path
        d="M25 55 Q25 62 40 62 Q55 62 55 55 L52 50 Q40 52 28 50 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Tiny gift shop inside */}
      <rect x="34" y="42" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <line x1="34" y1="40" x2="40" y2="36" stroke="currentColor" strokeWidth="0.75" />
      <line x1="46" y1="40" x2="40" y2="36" stroke="currentColor" strokeWidth="0.75" />
      {/* Falling dashes */}
      <line x1="30" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="1" />
      <line x1="44" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="35" y1="30" x2="38" y2="30" stroke="currentColor" strokeWidth="0.75" />
      <line x1="48" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: GiftShopProduct }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white border border-museum-200 p-5 relative transition-shadow duration-200"
      style={{
        boxShadow: isHovered
          ? "4px 4px 0px rgba(0,0,0,0.08)"
          : "2px 2px 0px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sold Out Badge */}
      <div className="absolute top-3 right-3 bg-museum-900 text-museum-50 text-[9px] uppercase tracking-widest px-2 py-1 font-sans">
        Sold Out
      </div>

      {/* Product Image */}
      <div className="h-32 w-full flex items-center justify-center text-museum-800 mb-4 border-b border-museum-100 pb-4">
        {product.svgContent}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div>
          <h3 className="font-serif text-base text-museum-900">{product.name}</h3>
          {product.latinName && (
            <p className="font-serif text-xs italic text-stone-500">{product.latinName}</p>
          )}
        </div>

        <p className="font-sans text-xs text-museum-800 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-museum-100">
          <span className="font-serif text-sm text-museum-900 line-through opacity-60">
            {product.price}
          </span>
          <span className="font-sans text-[9px] uppercase tracking-wider text-stone-500">
            Item #{product.id}
          </span>
        </div>

        {product.stockNote && (
          <p className="font-sans text-[10px] italic text-stone-400 mt-2">
            Note: {product.stockNote}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GIFT SHOP PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function GiftShopPage() {
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));

  // Override body background to match museum aesthetic
  useEffect(() => {
    const originalBackground = document.body.style.background;
    const originalTransition = document.body.style.transition;

    document.body.style.transition = "background 0.3s ease-in-out";
    document.body.style.background = "#f9f8f6"; // museum-50

    return () => {
      document.body.style.background = originalBackground;
      setTimeout(() => {
        document.body.style.transition = originalTransition;
      }, 300);
    };
  }, []);

  return (
    <div className="min-h-screen bg-museum-50">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-block border-4 border-double border-museum-900 bg-white px-8 py-6 mb-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
            The Museum of Dashes
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-museum-900 uppercase">
            Gift Shop
          </h1>
          <h2 className="font-serif text-lg md:text-xl tracking-wide text-museum-800 mt-1">
            &amp; Acquisitions Desk
          </h2>
        </div>

        <div className="w-16 h-[2px] bg-museum-900 mx-auto mb-6" />

        <p className="font-serif text-sm md:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
          A curated selection of typographic ephemera, commemorative goods, and educational materials.
          All proceeds support the ongoing preservation and classification of endangered horizontal marks.
        </p>

        <div className="mt-6 p-4 bg-white border border-museum-200 max-w-md mx-auto">
          <p className="font-sans text-xs text-stone-600 uppercase tracking-wide mb-1">
            Notice to Visitors
          </p>
          <p className="font-serif text-xs text-stone-500 italic">
            Due to unprecedented demand and a series of inventory-related incidents,
            all items are currently unavailable for purchase. The management apologizes
            for any inconvenience and reminds visitors that wanting is itself a form of having.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-20">
        {categories.map((category) => (
          <section key={category} className="mb-16">
            <div className="border-b border-museum-300 pb-2 mb-6">
              <h2 className="font-serif text-xl tracking-wide text-museum-900">{category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTS.filter((p) => p.category === category).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

        {/* Empty Cart Notice */}
        <div className="mt-12 text-center border-t border-museum-200 pt-12">
          <div className="inline-block border border-museum-200 bg-white px-6 py-4">
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-1">
              Shopping Cart
            </p>
            <p className="font-serif text-sm text-stone-500">
              Your cart is empty—
            </p>
            <p className="font-serif text-xs italic text-stone-400">
              as are all carts, in the end.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-museum-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="font-serif text-lg text-museum-800 mb-4">❦</p>
          <p className="font-serif text-xs text-stone-500 mb-2">
            No actual transactions can or will be processed.
          </p>
          <p className="font-sans text-[10px] text-stone-400 mb-4">
            The Museum of Dashes Gift Shop is a subsidiary of the Department of Typographic Ephemera.
          </p>

          <Link
            href="/featured/museum-of-dashes"
            className="inline-block font-sans text-xs uppercase tracking-widest text-museum-900 hover:text-stone-600 transition-colors border-b border-museum-900 hover:border-stone-600 pb-0.5"
          >
            ← Return to Museum
          </Link>
        </div>
      </footer>
    </div>
  );
}
