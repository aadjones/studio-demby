"use client";
import dynamic from "next/dynamic";

// Load the real sketch only on the client (p5 requires window).
// The loading placeholder reserves space to reduce layout shift.
export default dynamic(
  () => import("./FeathersPlaygroundClient"),
  {
    ssr: false,
    loading: () => (
      <section className="mb-12 not-prose">
        <h2 className="text-2xl font-semibold mb-4">Molting Grounds</h2>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-8">
          <div className="w-full sm:w-[512px] aspect-square rounded-lg shadow-md bg-white" />
        </div>
      </section>
    ),
  }
);
