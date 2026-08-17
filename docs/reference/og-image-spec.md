# OG Image Spec

## Concept
Minimal design with cream background, centered "Studio Demby" text, and a small coral accent triangle in the top-left corner.

## Dimensions
1200 x 630 px (standard OG image)

## Colors (from tailwind.config.js)
- Background: Cream (#FFF8F0) — `atmosphere.cream`
- Text: Ink (#1A1A1A) — `ink.900`
- Accent: Coral (#FF6B6B) — `brand.coral`

## ImageMagick Command
```bash
magick -size 1200x630 xc:'#FFF8F0' \
  -fill '#FF6B6B' -draw 'polygon 0,0 200,0 0,130' \
  -font Helvetica-Bold -pointsize 72 -fill '#1A1A1A' \
  -gravity center -annotate 0 'Studio Demby' \
  public/opengraph-image.png
```

## Notes
- Font: Helvetica-Bold (system font, closest available to Outfit which is used on site)
- Pairs with metadata: "Studio Demby" title + "I make things that sound, analyze, provoke, and teach." description
