"use client";
import dynamic from "next/dynamic";

const BloodFeathersHero = dynamic(
  () => import("./BloodFeathersHeroClient"),
  { ssr: false }
);

export default BloodFeathersHero;
