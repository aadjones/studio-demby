"use client";

import { hydrate, type SerializeResult } from "next-mdx-remote-client/csr";
import dynamic from "next/dynamic";
import MDXImage from "../media/MDXImage";

// Components
import { Callout } from "../mdx-blocks/Callout";
import CallToAction from "../mdx-blocks/CallToAction";
import MediaSection from "../mdx-blocks/MediaSection";
import MediaItem from "../mdx-blocks/MediaItem";
import ProjectOverview from "../mdx-blocks/ProjectOverview";
import TechnicalDetails from "../mdx-blocks/TechnicalDetails";
import { ZoomImage } from "../media/ZoomImage";
import { CaptionComponent } from "../mdx-blocks/Caption";
import CollapseMetadata from "../mdx-blocks/CollapseMetadata";
import FieldNote from "../mdx-blocks/FieldNote";
import Footnote from "../mdx-blocks/Footnote";
import GalleryOfLies from "../surreal-systems/GalleryOfLies";
import LoopRoomTrack from "../project-looproom/LoopRoomTrack";
import MovementBlock from "../mdx-blocks/MovementBlock";
import HeroBlock from "../mdx-blocks/HeroBlock";
import HeroCarouselBlock from "../mdx-blocks/HeroCarouselBlock";
import SectionNav from "../layout/SectionNav";
import WisdomTeethCodex from "../surreal-systems/WisdomTeethCodex";
import HeroTitleBlock from "../mdx-blocks/HeroTitleBlock";
import PolybloomPlayground from "../surreal-systems/PolybloomPlayground";
import GospelCarousel from "../surreal-systems/GospelCarousel";
import ShrimpJesusFAQ from "../surreal-systems/ShrimpJesusFAQ";
import AmbientLoop from "../mdx-blocks/AmbientLoop";
import VideoFile from "../mdx-blocks/VideoFile";
import MechanicsVisualizer from "../mdx-blocks/MechanicsVisualizer";
const TimeVisualizer = dynamic(() => import("../mdx-blocks/TimeVisualizer"), { ssr: false });
import LeapSecondBettingMarket from "../mdx-blocks/LeapSecondBettingMarket";
import VideoEmbed from "../mdx-blocks/VideoEmbed";
import MuseumExhibit from "../mdx-blocks/MuseumExhibit";
import SticksAndSticks from "../mdx-blocks/SticksAndSticks";
import PetrolNoise from "../mdx-blocks/PetrolNoise";
import GrainRain from "../mdx-blocks/GrainRain";
import LightboxGallery from "../mdx-blocks/LightboxGallery";
import LaunchExperience from "../mdx-blocks/LaunchExperience";
import EmbedExperience from "../mdx-blocks/EmbedExperience";
import BirdCards from "../mdx-blocks/bird-cards/BirdCards";
import InharmonicSynth from "../mdx-blocks/inharmonicity/InharmonicSynth";
import RealPianoSpectrum from "../mdx-blocks/inharmonicity/RealPianoSpectrum";
import ClefGlyphs from "../mdx-blocks/clef-rake/ClefGlyphs";
import ClefRake from "../mdx-blocks/clef-rake/ClefRake";
import ContourFigure from "../mdx-blocks/clef-rake/ContourFigure";
import PitchLadder from "../mdx-blocks/clef-rake/PitchLadder";
import LetterToGlyph from "../mdx-blocks/clef-rake/LetterToGlyph";
import LineAndSpace from "../mdx-blocks/clef-rake/LineAndSpace";
import MiddleCAcrossClefs from "../mdx-blocks/clef-rake/MiddleCAcrossClefs";
import MiddleLineShift from "../mdx-blocks/clef-rake/MiddleLineShift";
import StaffCutaway from "../mdx-blocks/clef-rake/StaffCutaway";
import UnnamedClefs from "../mdx-blocks/clef-rake/UnnamedClefs";

type ComponentType = React.ComponentType<any> | string;

type ClientMDXProps = {
  mdxSource: SerializeResult;
  frontMatter?: Record<string, any>;
  overrides?: Record<string, ComponentType>;
};

// Custom component map
const baseComponents = {
  p: "p",
  Image: MDXImage,
  Callout,
  CallToAction,
  MediaSection,
  MediaItem,
  ProjectOverview,
  TechnicalDetails,
  ZoomImage,
  Caption: CaptionComponent,
  CollapseMetadata,
  FieldNote,
  Footnote,
  GalleryOfLies,
  LoopRoomTrack,
  MovementBlock,
  HeroBlock,
  HeroCarouselBlock,
  SectionNav,
  WisdomTeethCodex,
  HeroTitleBlock,
  PolybloomPlayground,
  GospelCarousel,
  ShrimpJesusFAQ,
  AmbientLoop,
  VideoFile,
  MechanicsVisualizer,
  TimeVisualizer,
  LeapSecondBettingMarket,
  VideoEmbed,
  MuseumExhibit,
  SticksAndSticks,
  PetrolNoise,
  GrainRain,
  LightboxGallery,
  LaunchExperience,
  EmbedExperience,
  BirdCards,
  InharmonicSynth,
  RealPianoSpectrum,
  ClefGlyphs,
  ClefRake,
  ContourFigure,
  LetterToGlyph,
  LineAndSpace,
  MiddleCAcrossClefs,
  MiddleLineShift,
  PitchLadder,
  UnnamedClefs,
  StaffCutaway,
};

export default function ClientMDX({
  mdxSource,
  frontMatter = {},
  overrides = {},
}: ClientMDXProps) {
  // Handle serialization errors
  if ("error" in mdxSource) {
    console.error("MDX serialization error:", mdxSource.error);
    return <div className="text-red-500">Error rendering content</div>;
  }

  const injectedComponents: Record<string, React.ComponentType<any>> = {};

  for (const [name, Component] of Object.entries({
    ...baseComponents,
    ...overrides,
  })) {
    if (typeof Component === "string") {
      injectedComponents[name] = Component as unknown as React.ComponentType<any>;
    } else {
      const ComponentAsAny = Component as any;
      injectedComponents[name] = (props: any) => (
        <ComponentAsAny
          {...frontMatter}
          {...props} // MDX props take precedence
          className={`not-prose ${props.className || ""}`}
        />
      );
    }
  }

  const { content, error } = hydrate({
    ...mdxSource,
    components: injectedComponents,
  });

  if (error) {
    console.error("MDX hydration error:", error);
    return <div className="text-red-500">Error rendering content</div>;
  }

  return (
    <div className="prose prose-neutral max-w-none">
      {content}
    </div>
  );
}
