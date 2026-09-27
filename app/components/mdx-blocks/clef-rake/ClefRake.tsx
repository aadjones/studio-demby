"use client";

import "./clef-rake.css";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  clefAt,
  clefByName,
  nearestClef,
  signPitch,
  snapStaffBottom,
  stepClef,
  topPitch,
} from "./lib/clefs";
import {
  DEFAULT_INSTRUMENT,
  INSTRUMENTS,
  coreText,
  extText,
  type Instrument,
} from "./lib/instruments";
import {
  MIDDLE_C,
  toSolfege,
  type Diatonic,
  type NameSystem,
} from "./lib/pitch";
import {
  ARROW_HALF_H,
  HINT_DY,
  SIGN_X,
  STAFF_X0,
  STAFF_X1,
  STAFF_X1_NOTCHED,
  LADDER_VIEW_H,
  VIEW_W,
  VIEW_W_NO_NOTCHES,
  hintX,
  ladderViewBox,
  ladderViewFraction,
  yOf,
} from "./layout";
import ClefMarker from "./ClefMarker";
import ClefNotches from "./ClefNotches";
import ClefSign from "./ClefSign";
import HaloText from "./HaloText";
import NoteLadder from "./NoteLadder";
import PitchGrid from "./PitchGrid";
import RangeLayer from "./RangeLayer";
import StaffLines from "./StaffLines";
import { useStaffDrag } from "./useStaffDrag";

/** Alto—the least familiar clef, which is rather the point. */
const DEFAULT_CLEF = clefAt(24)!;

export interface ClefRakeProps {
  /**
   * Let the staff sit on any third of the ladder instead of only the seven
   * historical clef stops, and mark middle C rather than whichever note the
   * clef is named after.
   *
   * Still thirds: a staff line is `bottom + 2k`, so a shift of an odd number of
   * steps would drop the lines onto the ladder's spaces and strand middle C in
   * one. Seventeen positions rather than seven, all of them lines-on-lines.
   *
   * The two go together and cannot be separated. The marker letter *is*
   * `clef.sign`, drawn on the note the clef is named for — so off a stop there
   * is no clef and no letter to draw. Middle C is the one reference that
   * survives being dragged anywhere, and it is the anchor the article has been
   * building on since section 2.
   *
   * The free-sliding section wants this. The later sections are specifically
   * about the seven real clefs, so they leave it off.
   */
  freeSlice?: boolean;
  /**
   * Whether the reader can move the staff. Off where the article first
   * shows *a* slice sitting still — one figure, one idea. The next section is
   * where moving it becomes the point, and turns this back on.
   *
   * When off, the drag target, the arrows and the "drag ↕" hint all go. The
   * staff itself is drawn by exactly the same code either way, so the two
   * sections cannot drift apart.
   */
  interactive?: boolean;
  /**
   * `"letter"` marks the staff with the plain name of the note the clef points
   * at. `"glyph"` swaps in the real clef symbols at the same position, for the
   * reveal at the end of the article.
   */
  marker?: "letter" | "glyph";
  /**
   * Instrument ranges and ledger lines. Off by default: the article earns its
   * way to instruments only at the very end, after the seven clefs have been
   * explained on their own terms.
   */
  showInstrument?: boolean;
  /**
   * The seven clickable clef stops down the right-hand edge, labelled with
   * clef abbreviations. Off by default: the abbreviations name clefs, and the
   * article does not name them until the very end. Drag and the arrows still
   * move the staff without them.
   */
  showNotches?: boolean;
  /** The letters/solfège toggle. Off by default—one idea at a time. */
  showSolfege?: boolean;
  /**
   * ClientMDX injects `not-prose` here on every registered component. Drop it
   * and the surrounding `.prose` typography leaks into the controls.
   */
  className?: string;
}

export default function ClefRake({
  freeSlice = false,
  interactive = true,
  marker = "letter",
  showInstrument = false,
  showNotches = false,
  showSolfege = false,
  className = "",
}: ClefRakeProps) {
  const [bottom, setBottom] = useState<Diatonic>(DEFAULT_CLEF.bottom);
  const [instrument, setInstrument] = useState<Instrument | null>(
    DEFAULT_INSTRUMENT
  );
  const [nameSystem, setNameSystem] = useState<NameSystem>("letters");
  const [hintVisible, setHintVisible] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);
  const [svgHeight, setSvgHeight] = useState(LADDER_VIEW_H);

  // Where the staff is allowed to land. A free slice takes any third on the
  // ladder; otherwise it must be one of the seven named clefs. Either way the
  // five lines stay on rungs — neither option can put them on spaces.
  const snap = useCallback(
    (want: number) =>
      freeSlice ? snapStaffBottom(want) : nearestClef(want).bottom,
    [freeSlice]
  );

  // Every move funnels through `snap`, so the drag, the arrows and the notches
  // cannot disagree about what counts as a legal position.
  const moveTo = useCallback(
    (next: Diatonic) => {
      setBottom(snap(next));
      setHintVisible(false);
    },
    [snap]
  );

  const onPointerDown = useStaffDrag(svgRef, bottom, moveTo, snap);

  // The arrow cluster tracks the staff, so it stays within thumb reach of the
  // thing it moves.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      setSvgHeight(entry.contentRect.height || LADDER_VIEW_H);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Undefined whenever a free drag has left the staff between the seven stops,
  // which is most positions once `freeSlice` is on.
  const clef = clefAt(bottom);
  const top = topPitch(bottom);
  // The clef stops need room for full names, so the lines give up their empty
  // right-hand end when they are shown. Nothing else changes size.
  const staffX1 = showNotches ? STAFF_X1_NOTCHED : STAFF_X1;
  const shownInstrument = showInstrument ? instrument : null;

  // A third either way. Free slices land on the next third, named or not;
  // the rake skips to the next of the seven, which is also a third away.
  const step = (delta: 1 | -1) =>
    clef && !freeSlice ? stepClef(clef, delta).bottom : bottom + 2 * delta;

  // The arrows are HTML, not SVG, so they have to be mapped through the ladder
  // viewBox by hand — including the margin the "keeps going" dots added.
  const arrowTop = Math.max(
    0,
    ladderViewFraction(yOf(bottom + 4)) * svgHeight - ARROW_HALF_H
  );

  return (
    <div className={`clef-rake ${className}`.trim()}>
      <div className="row">
        {showInstrument && (
          <label>
            Instrument{" "}
            <select
              value={instrument ? INSTRUMENTS.indexOf(instrument) : "none"}
              onChange={(e) => {
                const next =
                  e.target.value === "none"
                    ? null
                    : INSTRUMENTS[Number(e.target.value)];
                setInstrument(next);
                // Land on the clef this instrument actually reads. The reader
                // can still drag away — that comparison is the whole section —
                // but the starting point should be the real-world answer
                // rather than wherever the staff happened to be left.
                const home = next && clefByName(next.clef);
                if (home) moveTo(home.bottom);
              }}
            >
              {INSTRUMENTS.map((inst, i) => (
                <option key={inst.name} value={i}>
                  {inst.name}
                </option>
              ))}
              <option value="none">No instrument</option>
            </select>
          </label>
        )}

        {showSolfege && (
          <div className="seg" role="group" aria-label="Note names">
            {(
              [
                ["letters", "C D E"],
                ["solfege", "Do Re Mi"],
              ] as const
            ).map(([system, label]) => (
              <button
                key={system}
                aria-pressed={nameSystem === system}
                onClick={() => setNameSystem(system)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*
        Directly under the picker rather than below the drawing: the range
        belongs to the instrument you just chose, and putting it here keeps the
        two together instead of making the reader look past the staff for it.
      */}
      {shownInstrument && (
        <p className="inst">{describe(shownInstrument, nameSystem)}</p>
      )}

      <div className="stage">
        <svg
          ref={svgRef}
          viewBox={ladderViewBox(showNotches ? VIEW_W : VIEW_W_NO_NOTCHES)}
          aria-label={
            !interactive
              ? "Pitch ladder with a five-line staff on it, middle C on the middle line"
              : freeSlice
                ? "Pitch ladder with a staff that can be dragged to any position, middle C marked"
                : "Pitch ladder with movable staff"
          }
        >
          {/* Paint order matters: notches, ladder, ledger lines, staff,
              marker, hint, notes, then the transparent drag target. */}
          {showNotches && clef && (
            <ClefNotches current={clef} onSelect={(c) => moveTo(c.bottom)} />
          )}
          <PitchGrid bottom={bottom} x1={staffX1} />
          {shownInstrument && (
            <RangeLayer bottom={bottom} instrument={shownInstrument} />
          )}
          <StaffLines bottom={bottom} x1={staffX1} />

          {/*
            A free slice always marks middle C, wherever the staff has been
            dragged to — including well off the staff, which is the honest
            answer and the thing worth seeing. Only a staff sitting on one of
            the seven can be named, so only then is there a sign to draw.
          */}
          {freeSlice || !clef ? (
            <ClefMarker type="C" x={SIGN_X} y={yOf(MIDDLE_C)} />
          ) : marker === "glyph" ? (
            <ClefSign type={clef.sign} x={SIGN_X} y={yOf(signPitch(clef))} />
          ) : (
            <ClefMarker type={clef.sign} x={SIGN_X} y={yOf(signPitch(clef))} />
          )}

          {interactive && hintVisible && (
            <HaloText
              x={hintX(staffX1)}
              y={yOf(top) + HINT_DY}
              fontSize={11}
              textAnchor="middle"
              fill="var(--soft)"
              halo={4}
            >
              drag ↕
            </HaloText>
          )}

          <NoteLadder
            bottom={bottom}
            instrument={shownInstrument}
            nameSystem={nameSystem}
          />

          {interactive && (
            <rect
              id="hit"
              x={STAFF_X0 - 6}
              y={yOf(top) - 12}
              width={staffX1 - STAFF_X0 + 12}
              height={yOf(bottom) - yOf(top) + 24}
              fill="transparent"
              onPointerDown={onPointerDown}
            />
          )}
        </svg>

        {/*
          The arrows column is dropped entirely rather than left empty, so the
          static figure spans the full width the bare ladder above it does. The
          two drawings then sit at the same scale, which is the whole claim
          section 3 is making.
        */}
        {interactive && (
          <div className="arrows">
            <div style={{ top: arrowTop }}>
              <button
                aria-label={
                freeSlice ? "Move the staff up a third" : "Next clef up (a third higher)"
              }
                onClick={() => moveTo(step(1))}
              >
                ▲
              </button>
              <button
                aria-label={
                freeSlice ? "Move the staff down a third" : "Next clef down (a third lower)"
              }
                onClick={() => moveTo(step(-1))}
              >
                ▼
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function describe(instrument: Instrument, nameSystem: NameSystem): string {
  const sentence = [
    `${instrument.name} (written): usually ${coreText(instrument)}, full range ${extText(instrument)}.`,
    instrument.note,
    nameSystem === "solfege" ? "Octave numbers count middle C as Do4." : "",
  ]
    .filter(Boolean)
    .join(" ");

  return nameSystem === "solfege" ? toSolfege(sentence) : sentence;
}
