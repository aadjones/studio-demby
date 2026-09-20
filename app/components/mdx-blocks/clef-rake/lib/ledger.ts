import { CLEFS, topPitch, type Clef } from "./clefs";
import type { Diatonic } from "./pitch";

export interface LedgerCount {
  below: number;
  above: number;
}

/**
 * How many ledger lines a range spanning `lo`..`hi` needs on a staff whose
 * bottom line is `bottom`.
 *
 * Ledger lines continue the staff's every-other-diatonic-step spacing, so each
 * one covers two diatonic steps—hence the halving. A note sitting in the space
 * just past the staff needs no ledger line, which is why this floors.
 */
export function ledgerCount(
  lo: Diatonic,
  hi: Diatonic,
  bottom: Diatonic
): LedgerCount {
  const top = topPitch(bottom);
  return {
    below: lo < bottom ? Math.floor((bottom - lo) / 2) : 0,
    above: hi > top ? Math.floor((hi - top) / 2) : 0,
  };
}

export function ledgerTotal(
  lo: Diatonic,
  hi: Diatonic,
  bottom: Diatonic
): number {
  const { below, above } = ledgerCount(lo, hi, bottom);
  return below + above;
}

/**
 * Every clef that minimises the total ledger lines for a range—all of them,
 * because ties are common and meaningful (a range can sit equally well in two
 * neighbouring clefs).
 */
export function bestClefs(lo: Diatonic, hi: Diatonic): Clef[] {
  const totals = CLEFS.map((c) => ledgerTotal(lo, hi, c.bottom));
  const min = Math.min(...totals);
  return CLEFS.filter((_, i) => totals[i] === min);
}
