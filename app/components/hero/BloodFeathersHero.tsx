"use client";
import dynamic from "next/dynamic";

const BloodFeathersHero = dynamic(
  () => import("./BloodFeathersHeroClient"),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: "70dvh", width: "100vw", marginLeft: "calc(-50vw + 50%)", backgroundColor: "#f0f0f0" }} />
    ),
  }
);

export default BloodFeathersHero;
