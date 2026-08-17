"use client";

import { hydrate, type SerializeResult } from "next-mdx-remote-client/csr";
import dynamic from "next/dynamic";
import MDXImage from "../media/MDXImage";

// Components
import { YouTubeComponent } from "../media/YouTube";
import SoundCloudEmbed from "../media/SoundCloud";
import { Callout } from "../mdx-blocks/Callout";
import CallToAction from "../mdx-blocks/CallToAction";
import MediaSection from "../mdx-blocks/MediaSection";
import MediaItem from "../mdx-blocks/MediaItem";
import ProjectIntro from "../mdx-blocks/ProjectIntro";
import ProjectOverview from "../mdx-blocks/ProjectOverview";
import TechnicalDetails from "../mdx-blocks/TechnicalDetails";
import { ZoomImage } from "../media/ZoomImage";
import { CaptionComponent } from "../mdx-blocks/Caption";
import CollapseMetadata from "../mdx-blocks/CollapseMetadata";
import FieldNote from "../mdx-blocks/FieldNote";
import Footnote from "../mdx-blocks/Footnote";
import SacredScroll from "../surreal-systems/SacredScroll";
import GalleryOfLies from "../surreal-systems/GalleryOfLies";
import LoopRoomTrack from "../project-looproom/LoopRoomTrack";
import LoopRoomIntro from "../project-looproom/LoopRoomIntro";
import LoopRoomInterlude from "../project-looproom/LoopRoomInterlude";
import LoopPlayer from "../project-looproom/LoopPlayer";
import MovementBlock from "../mdx-blocks/MovementBlock";
import HeroBlock from "../mdx-blocks/HeroBlock";
import HeroCarouselBlock from "../mdx-blocks/HeroCarouselBlock";
import { ImageGrid } from "../media/ImageGrid";
import SectionNav from "../layout/SectionNav";
import ShatterPlayground from "../surreal-systems/ShatterPlayground";
import WisdomTeethCodex from "../surreal-systems/WisdomTeethCodex";
import HeroTitleBlock from "../mdx-blocks/HeroTitleBlock";
import SimpleVideoBlock from "../mdx-blocks/SimpleVideoBlock";
import FeathersPlayground from "../surreal-systems/FeathersPlayground";
import PolybloomPlayground from "../surreal-systems/PolybloomPlayground";
import GospelCarousel from "../surreal-systems/GospelCarousel";
import SpatialSynthesizer from "../surreal-systems/SpatialSynthesizer/index";
import EncasedMeltingSphere from "../mdx-blocks/EncasedMeltingSphere";
import MeltdownDiptych from "../surreal-systems/MeltdownDiptych";
import ShrimpJesusFAQ from "../surreal-systems/ShrimpJesusFAQ";
import FullscreenVideo from "../FullscreenVideo";
import VideoPlayer from "../media/VideoPlayer";
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
  YouTube: YouTubeComponent,
  SoundCloudEmbed,
  Callout,
  CallToAction,
  MediaSection,
  MediaItem,
  ProjectIntro,
  ProjectOverview,
  TechnicalDetails,
  ZoomImage,
  Caption: CaptionComponent,
  CollapseMetadata,
  FieldNote,
  Footnote,
  SacredScroll,
  GalleryOfLies,
  LoopRoomTrack,
  LoopRoomIntro,
  LoopRoomInterlude,
  LoopPlayer,
  MovementBlock,
  HeroBlock,
  HeroCarouselBlock,
  ImageGrid,
  SectionNav,
  ShatterPlayground,
  EncasedMeltingSphere,
  SpatialSynthesizer,
  WisdomTeethCodex,
  HeroTitleBlock,
  SimpleVideoBlock,
  FeathersPlayground,
  PolybloomPlayground,
  MeltdownDiptych,
  GospelCarousel,
  ShrimpJesusFAQ,
  FullscreenVideo,
  VideoPlayer,
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
