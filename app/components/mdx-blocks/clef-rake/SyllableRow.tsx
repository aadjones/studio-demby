import { PHRASE } from "./lib/twinkle";

interface Props {
  /** x of syllable `i`. Each figure spaces the tune differently. */
  xOf: (i: number) => number;
  /** Baseline all the syllables and hyphens share. */
  y: number;
  fontSize: number;
  /**
   * Halo width, for the figures whose syllable row crosses a staff line. Left
   * off where there is nothing behind the text to knock out.
   */
  halo?: number;
}

/**
 * The line of lyrics under the tune, with the hyphens that hold each word
 * together: Twin-kle twin-kle lit-tle star.
 *
 * Shared by all three figures that carry the phrase. They set it at three
 * different sizes and spacings, but the words have to break in the same places
 * in every one of them, so where the breaks fall lives in `lib/twinkle` and the
 * drawing lives here, rather than being copied out three times.
 *
 * Each hyphen sits midway between the two syllables it joins — where an
 * engraver would put it, and conveniently the widest gap going.
 *
 * This does not use `HaloText`, which halos one piece of text at a time: a
 * hyphen drawn that way knocks a bite out of the syllable already drawn to its
 * left, and at the cutaway's spacing "Twin-" lost its "n". The row needs every
 * halo laid down first and every letter painted over the lot, so the two passes
 * are spelled out here instead.
 */
export default function SyllableRow({ xOf, y, fontSize, halo }: Props) {
  const marks: { key: string; x: number; text: string }[] = [];

  PHRASE.forEach((s, i) => {
    marks.push({ key: `s-${i}`, x: xOf(i), text: s.text });
    if (s.hyphenAfter) {
      marks.push({ key: `h-${i}`, x: (xOf(i) + xOf(i + 1)) / 2, text: "-" });
    }
  });

  return (
    <>
      {halo
        ? marks.map(({ key, x, text }) => (
            <text
              key={`halo-${key}`}
              aria-hidden="true"
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={fontSize}
              fill="var(--bg)"
              stroke="var(--bg)"
              strokeWidth={halo}
              strokeLinejoin="round"
            >
              {text}
            </text>
          ))
        : null}

      {marks.map(({ key, x, text }) => (
        <text
          key={key}
          x={x}
          y={y}
          textAnchor="middle"
          fontSize={fontSize}
          fill="var(--ink)"
        >
          {text}
        </text>
      ))}
    </>
  );
}
