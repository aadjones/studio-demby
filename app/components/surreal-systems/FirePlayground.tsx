"use client";
import dynamic from "next/dynamic";

// Load the real sketch only on the client
export default dynamic(
  () => import("./FirePlaygroundClient"),
  { ssr: false }
);
