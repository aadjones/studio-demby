import React from "react";
import { SectionType, SectionData } from "./types";

// Museum escalation thresholds (in total taps)
export const ESCALATION_THRESHOLDS = {
  WARNING: 3,      // Level 1: First warning notice appears
  REBELLION: 6,    // Level 2: All dashes rotate 90° permanently
  SHUTDOWN: 12,    // Level 3: Museum dims and specimens disappear
} as const;

export const MUSEUM_SECTIONS: SectionData[] = [
  {
    id: SectionType.CANONICAL,
    title: "The Canonical Gallery",
    preamble:
      "The following specimens are widely recognized by international typographic bodies. Their behavior is predictable, their width standardized, and their usage documented in style guides dating back to the 19th century.",
    specimens: [
      {
        id: "c-1",
        glyph: "-",
        name: "Hyphen",
        latinName: "Divisio vulgaris",
        description:
          "The most common and hardest working of the horizontal connectors. Primarily social, it joins words in compound formations or allows a word to break across lines, sacrificing its own integrity for the sake of justification.",
      },
      {
        id: "c-2",
        glyph: "–",
        name: "En Dash",
        latinName: "Jungens minor",
        description:
          "Often mistaken for the hyphen by the layperson, the En Dash is wider, more deliberate. It spans ranges of time and space, effectively saying 'from here to there' with silent efficiency.",
      },
      {
        id: "c-3",
        glyph: "—",
        name: "Em Dash",
        latinName: "Interruptio dramatica",
        description:
          "The diva of the dash family. It demands a full beat of silence. It creates a break in thought—abrupt, authoritative, and impossible to ignore—before allowing the sentence to resume.",
      },
      {
        id: "c-5",
        glyph: "_",
        name: "Underscore",
        latinName: "Sublinea digitalis",
        description:
          "Originally a proofreader's mark, it migrated to the typewriter and later the keyboard. It is a bottom-dweller, often found supporting filenames where spaces are forbidden.",
      },
    ],
  },
  {
    id: SectionType.STRUCTURAL,
    title: "Structural Bars & Mathematical Relatives",
    preamble:
      "While not strictly 'dashes' in the linguistic sense, these specimens share a distinct genetic marker: the horizontal stroke. Inclusion here is based on morphology rather than semantic function.",
    specimens: [
      {
        id: "s-1",
        glyph: "−",
        name: "Minus Sign",
        latinName: "Negatio arithmetica",
        description:
          "Visually distinct from the hyphen (lifted slightly higher, matching the crossbar of a plus sign). Its purpose is purely subtractive. It exists to remove, to lessen, to deny.",
      },
      {
        id: "s-2",
        glyph: "¯",
        name: "Macron",
        latinName: "Superlinea vocalis",
        description:
          "A bar that hovers above the letter, indicating a long vowel sound. It is a dash that has ascended to a higher plane of existence.",
      },
      {
        id: "s-4",
        glyph: "─",
        name: "The Vinculum",
        latinName: "Linea divisio",
        description:
          "A high-wire act for integers. It separates the numerator from the denominator, maintaining a precarious balance between two values that would otherwise collapse into a decimal.",
      },
      {
        id: "s-5",
        glyph: "━",
        name: "The Acoustic Dash (Dah)",
        latinName: "Signalus temporalis",
        description:
          "A dash that has transcended ink to become a duration of time. In the telegraphic taxonomy of Morse code, it is defined as three units of tone. It is the ghost of a dash—heard, but not always seen.",
        interactionType: "audio",
      },
    ],
  },
  {
    id: SectionType.VERTICAL,
    title: "Bars That Learned to Stand Upright",
    preamble:
      "A controversial wing of the museum. These specimens appear to be dashes that have undergone a 90-degree rotation, likely due to evolutionary pressures or extreme formatting constraints.",
    specimens: [
      {
        id: "v-1",
        glyph: "|",
        name: "Pipe",
        latinName: "Barra erectus",
        description:
          "A dash that refuses to lie down. In computing environments, it acts as a conduit; in mathematics, it represents absolute value—a rigid wall containing a number's magnitude.",
      },
      {
        id: "v-2",
        glyph: "¦",
        name: "Broken Bar",
        latinName: "Barra interrupta",
        description:
          "A vertical bar with a gap in its integrity. Often considered a vestigial trait from early character encodings (Code Page 437). It serves no distinct modern purpose other than to confuse.",
      },
      {
        id: "v-3",
        glyph: "¬",
        name: "Negation Sign",
        latinName: "Angulus negationis",
        description:
          "A dash with a handle. Used in logic to indicate 'not'. It suggests a horizontal connector that hit a wall and decided to turn down.",
      },
      {
        id: "v-4",
        glyph: "‖",
        name: "The Norm",
        latinName: "Barra geminus",
        description:
          "A pipe that fears loneliness. Always appearing in pairs to calculate magnitude, it suggests that one wall is not enough to contain the concept of 'size'.",
      },
    ],
  },
  {
    id: SectionType.MISIDENTIFIED,
    title: "Misidentifications & Reclassifications",
    preamble:
      "Not all horizontal marks retain their status upon closer inspection. The following were previously cataloged as dashes but have since been reclassified.",
    specimens: [
      {
        id: "m-1",
        glyph: "--",
        name: "The Double Hyphen",
        latinName: "Simulacrum em",
        description:
          "A primitive attempt to mimic the Em Dash in environments lacking typographic sophistication. It is not a true species, but a mimetic behavior observed in early internet habitats.",
      },
      {
        id: "m-2",
        glyph: "~",
        name: "Tilde",
        latinName: "Undula oscillans",
        description:
          "A dash that has lost its structural rigidity. It waves, it approximates. It suggests 'about' rather than 'is'. It is the dash of uncertainty.",
      },
      {
        id: "m-3",
        glyph: "Ξ",
        name: "The Triple Stack (Xi)",
        latinName: "Sandwichus graecus",
        description:
          "Frequently misidentified by digital natives as a 'hamburger menu.' In reality, it is an ancient Greek letter that realized three dashes are structurally more stable than one. It is the layered cake of connectors.",
        glyphClassName: "font-sans",
      },
      {
        id: "m-4",
        glyph: "二",
        name: "The Double Stack (Er)",
        latinName: "Dualis orientalis",
        description:
          "A minimalist rebuttal to the Triple Stack, originating from China. It argues that three lines are excessive when two suffice to establish a pattern. It is the only dash that counts itself.",
        glyphClassName: "font-sans",
      },
    ],
  },
  {
    id: SectionType.PROVISIONAL,
    title: "Provisional & Recently Identified Specimens",
    preamble:
      "The following specimens have been observed in specific digital micro-climates. Their classification is pending peer review.",
    specimens: [
      {
        id: "p-1",
        glyph: "¬_¬",
        name: "The Skeptical Connector",
        latinName: "Oculus judicans",
        description:
          "A complex compound organism using horizontal connectors as a bridge between two watchful eyes. It conveys distinct disapproval without words.",
      },
      {
        id: "p-2",
        glyph: " ",
        name: "The Ghost Dash",
        latinName: "Linea invisibilis",
        description:
          "A dash of zero width. It exists technically, guiding line breaks and joining characters, yet remains invisible to the naked eye. It is the dark matter of typography.",
      },
    ],
  },
  {
    id: SectionType.ANTHROPOMORPHIC,
    title: "Anthropomorphic & Condition-Based Specimens",
    preamble:
      "Recent field studies suggest that dashes may exhibit emotional states or transient conditions dependent on their textual environment.",
    specimens: [
      {
        id: "a-1",
        glyph: "—",
        name: "Exhausted Dash",
        latinName: "Em depressus",
        description:
          "Virtually indistinguishable from a standard Em Dash, but sits slightly lower on the baseline due to fatigue. Requires a microscope to diagnose.",
      },
      {
        id: "a-2",
        glyph: "---",
        name: "The Overcompensating Dash",
        latinName: "Triplus hyphen",
        description:
          "When a single dash feels inadequate, it may undergo mitosis, stretching itself into a three-segment barrier. Common in Markdown borders and impulsive email signatures.",
      },
    ],
  },
  {
    id: SectionType.INTERACTIVE,
    title: "Interactive Specimens",
    preamble:
      <>WARNING: The management is not responsible for any emotional distress caused by interacting with the following specimens. <strong>Do not tap on the glass.</strong></>,
    specimens: [
      {
        id: "i-1",
        glyph: "—",
        name: "The Evasive Dash",
        latinName: "Fugit continuus",
        description:
          "A dash with severe flight-or-fight response. It attempts to maintain structural integrity but will physically relocate when observed too closely.",
        interactionType: "evasive",
      },
      {
        id: "i-2",
        glyph: "–",
        name: "The Anxious Dash",
        latinName: "Tremulus minor",
        description:
          "This specimen vibrates at a high frequency when approached, suggesting a fundamental instability in its classification or perhaps just too much coffee.",
        interactionType: "anxious",
      },
    ],
  },
];
