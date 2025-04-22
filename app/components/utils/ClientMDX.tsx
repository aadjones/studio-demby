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
import { ImageGrid } from "../media/ImageGrid";
import SectionNav from "../layout/SectionNav";
import ShatterPlayground from "../surreal-systems/ShatterPlayground";
import WisdomTeethCodex from "../surreal-systems/WisdomTeethCodex";
import HeroTitleBlock from "../mdx-blocks/HeroTitleBlock";
import SimpleVideoBlock from "../mdx-blocks/SimpleVideoBlock";
import FeathersPlayground from "../surreal-systems/FeathersPlayground";
import FirePlayground from "../surreal-systems/FirePlayground";
import { rustVeilPreset, glacialStrikePreset } from "@/lib/data/firePresets";
import SpatialSynthesizerSketch from "../surreal-systems/SpatialSynthesizerSketch";
import EncasedMeltingSphere from "../mdx-blocks/EncasedMeltingSphere";

type ComponentType = React.ComponentType<any> | string;

type ClientMDXProps = {
  mdxSource: MDXRemoteSerializeResult;
  frontMatter?: Record<string, any>;
  overrides?: Record<string, ComponentType>;
};

// Custom component map
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
  FirePlayground
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

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote
        {...mdxSource}
        components={injectedComponents}
        scope={{ rustVeilPreset, glacialStrikePreset }}
      />
    </div>
  );
}
