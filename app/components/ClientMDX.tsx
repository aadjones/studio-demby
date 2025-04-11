"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import Image from "next/image";

// Components
import { YouTubeComponent } from "./youtube";
import SoundCloudEmbed from "./soundcloud";
import { Callout } from "./callout";
import CallToAction from "./call-to-action";
import MediaSection from "./media-section";
import MediaItem from "./media-item";
import ProjectIntro from "./project-intro";
import ProjectOverview from "./project-overview";
import TechnicalDetails from "./technical-details";
import { ZoomImage } from "./ZoomImage";
import { CaptionComponent } from "./caption";
import SpatialSynthesizerSketch from "./SpatialSynthesizerSketch";
import EncasedMeltingSphere from "./EncasedMeltingSphere";
import { ImageGrid } from "./image-grid";
import CollapseMetadata from "./CollapseMetadata";
import FieldNote from "./FieldNote";
import Whisper from "./Whisper";
import SacredScroll from "./SacredScroll";
import GalleryOfLies from "./GalleryOfLies";
import LoopRoomTrack from "./LoopRoomTrack";
import LoopRoomIntro from "./LoopRoomIntro";
import LoopRoomInterlude from "./LoopRoomInterlude";
import LoopPlayer from "./LoopPlayer";
import MovementBlock from "./MovementBlock";
import HeroBlock from "./HeroBlock";
import HeroCarouselBlock from "./HeroCarouselBlock";
import SectionNav from "./SectionNav";
import ShatterPlayground from "./ShatterPlayground";
// Register all base components here
const baseComponents = {
  p: "p",
  Image,
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
  Whisper,
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
};

type ClientMDXProps = {
  mdxSource: MDXRemoteSerializeResult;
  frontMatter?: Record<string, any>;
  overrides?: Record<string, React.ComponentType<any>>;
};

export default function ClientMDX({
  mdxSource,
  frontMatter = {},
  overrides = {},
}: ClientMDXProps) {
  const injectedComponents: Record<string, React.ComponentType<any>> = {};

  for (const [name, Component] of Object.entries({
    ...baseComponents,
    ...overrides,
  })) {
    injectedComponents[name] = (props: any) => (
      <Component
        {...frontMatter}
        {...props} // MDX props take precedence
      />
    );
  }

  return (
    <div className="prose max-w-none">
      <MDXRemote {...mdxSource} components={injectedComponents} />
    </div>
  );
}
