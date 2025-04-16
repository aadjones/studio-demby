"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import Image from "next/image";

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
import SpatialSynthesizerSketch from "../surreal-systems/SpatialSynthesizerSketch";
import EncasedMeltingSphere from "../mdx-blocks/EncasedMeltingSphere";
import { ImageGrid } from "../media/ImageGrid";
import CollapseMetadata from "../mdx-blocks/CollapseMetadata";
import FieldNote from "../mdx-blocks/FieldNote";
import Whisper from "../mdx-blocks/Whisper";
import SacredScroll from "../surreal-systems/SacredScroll";
import GalleryOfLies from "../surreal-systems/GalleryOfLies";
import LoopRoomTrack from "../project-looproom/LoopRoomTrack";
import LoopRoomIntro from "../project-looproom/LoopRoomIntro";
import LoopRoomInterlude from "../project-looproom/LoopRoomInterlude";
import LoopPlayer from "../project-looproom/LoopPlayer";
import MovementBlock from "../mdx-blocks/MovementBlock";
import HeroBlock from "../mdx-blocks/HeroBlock";
import HeroCarouselBlock from "../mdx-blocks/HeroCarouselBlock";
import SectionNav from "../layout/SectionNav";
import ShatterPlayground from "../surreal-systems/ShatterPlayground";
import WisdomTeethCodex from "../surreal-systems/WisdomTeethCodex";
import HeroTitleBlock from "../mdx-blocks/HeroTitleBlock";
import SimpleVideoBlock from "../mdx-blocks/SimpleVideoBlock";
import FeathersPlayground from "../surreal-systems/FeathersPlayground";
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
  EncasedMeltingSphere,
  SpatialSynthesizerSketch,
  WisdomTeethCodex,
  HeroTitleBlock,
  SimpleVideoBlock,
  FeathersPlayground,
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
