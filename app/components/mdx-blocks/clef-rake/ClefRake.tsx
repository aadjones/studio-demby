"use client";

import "./clef-rake.css";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  clefAt,
  signPitch,
  stepClef,
  topPitch,
  type Clef,
} from "./lib/clefs";
import {
  DEFAULT_INSTRUMENT,
  INSTRUMENTS,
  coreText,
  extText,
  type Instrument,
} from "./lib/instruments";
import { toSolfege, type NameSystem } from "./lib/pitch";
import {
  ARROW_HALF_H,
  HINT_X,
  SIGN_X,
  STAFF_X0,
  STAFF_X1,
  VIEW_H,
  VIEW_W,
  VIEW_W_NO_NOTCHES,
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
  marker = "letter",
  showInstrument = false,
  showNotches = false,
  showSolfege = false,
  className = "",
}: ClefRakeProps) {
  const [clef, setClef] = useState<Clef>(DEFAULT_CLEF);
  const [instrument, setInstrument] = useState<Instrument | null>(
    DEFAULT_INSTRUMENT
  );
  const [nameSystem, setNameSystem] = useState<NameSystem>("letters");
  const [hintVisible, setHintVisible] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);
  const [svgHeight, setSvgHeight] = useState(VIEW_H);

  const selectClef = useCallback((next: Clef) => {
    setClef(next);
    setHintVisible(false);
  }, []);

  const onPointerDown = useStaffDrag(svgRef, clef, selectClef);

  // The arrow cluster tracks the staff, so it stays within thumb reach of the
  // thing it moves.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      setSvgHeight(entry.contentRect.height || VIEW_H);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const bottom = clef.bottom;
  const top = topPitch(bottom);
  const shownInstrument = showInstrument ? instrument : null;

  const arrowTop = Math.max(
    0,
    (yOf(bottom + 4) / VIEW_H) * svgHeight - ARROW_HALF_H
  );

  return (
    <div className={`clef-rake ${className}`.trim()}>
      <div className="row">
        {showInstrument && (
          <label>
            Instrument{" "}
            <select
              value={instrument ? INSTRUMENTS.indexOf(instrument) : "none"}
              onChange={(e) =>
                setInstrument(
                  e.target.value === "none"
                    ? null
                    : INSTRUMENTS[Number(e.target.value)]
                )
              }
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

      <div className="stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${showNotches ? VIEW_W : VIEW_W_NO_NOTCHES} ${VIEW_H}`}
          aria-label="Pitch ladder with movable staff"
        >
          {/* Paint order matters: notches, ladder, ledger lines, staff,
              marker, hint, notes, then the transparent drag target. */}
          {showNotches && <ClefNotches current={clef} onSelect={selectClef} />}
          <PitchGrid bottom={bottom} />
          {shownInstrument && (
            <RangeLayer bottom={bottom} instrument={shownInstrument} />
          )}
          <StaffLines bottom={bottom} />

          {marker === "glyph" ? (
            <ClefSign type={clef.sign} x={SIGN_X} y={yOf(signPitch(clef))} />
          ) : (
            <ClefMarker type={clef.sign} x={SIGN_X} y={yOf(signPitch(clef))} />
          )}

          {hintVisible && (
            <HaloText
              x={HINT_X}
              y={yOf(bottom + 5) + 4}
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

          <rect
            id="hit"
            x={STAFF_X0 - 6}
            y={yOf(top) - 12}
            width={STAFF_X1 - STAFF_X0 + 12}
            height={yOf(bottom) - yOf(top) + 24}
            fill="transparent"
            onPointerDown={onPointerDown}
          />
        </svg>

        <div className="arrows">
          <div style={{ top: arrowTop }}>
            <button
              aria-label="Next clef up (a third higher)"
              onClick={() => selectClef(stepClef(clef, 1))}
            >
              ▲
            </button>
            <button
              aria-label="Next clef down (a third lower)"
              onClick={() => selectClef(stepClef(clef, -1))}
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {shownInstrument && (
        <p className="inst">{describe(shownInstrument, nameSystem)}</p>
      )}
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
