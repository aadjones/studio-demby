import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { metaData } from "@/app/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aaron Demby Jones builds generative instruments, strange little apps, audiovisual experiments, and teaching frameworks for improvisation.",
  openGraph: {
    title: "About",
    description:
      "Aaron Demby Jones builds generative instruments, strange little apps, audiovisual experiments, and teaching frameworks for improvisation.",
    url: `${metaData.baseUrl}about`,
    siteName: metaData.name,
    images: [
      {
        url: "/photos/about/profile.png",
        alt: "Aaron Demby Jones",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Studio Demby",
    description:
      "Aaron Demby Jones builds generative instruments, strange little apps, audiovisual experiments, and teaching frameworks for improvisation.",
    images: ["/photos/about/profile.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">About</h1>
      <div className="flex flex-col items-center sm:items-start">
        <Image
          src="/photos/about/profile.png"
          alt="Aaron Demby Jones"
          width={140}
          height={140}
          priority
          className="rounded-full mb-4 sm:mb-8 w-[140px] sm:w-[200px] h-[140px] sm:h-[200px]"
        />
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-lg">
          <p>
            I&rsquo;m Aaron Demby Jones. My work comes from a long obsession
            with systems. I especially enjoy structures that misbehave: patterns
            with a mind of their own, tools that talk back, feedback loops that
            blow up.
          </p>
          <p>
            I work in many disciplines, but there is often an underlying thread
            to my methods. Whenever possible, I crawl inside a system, tweak a
            few rules, and see what emerges. Sometimes it&rsquo;s musical,
            sometimes visual, sometimes mathematical or satirical. Really, it is
            all a form of improvisation. The method is usually the same: hold
            most things steady, change one, and pay attention to what happens.
          </p>
          <p>
            I build generative instruments, strange little apps, audiovisual
            experiments, frog-flavored math, and teaching frameworks for
            improvisation. My practice mixes logic and mischief: algorithms,
            randomness, glitches, and playful constraint.
          </p>
          <p>
            A lot of my work comes from giving up the goal of control or
            perfection. I like when the system surprises me or when it gives me
            something &lsquo;wrong.&rsquo; A lot of rigid structures can come to
            life if you actually let them.
          </p>

          <div className="pt-6 sm:pt-8 border-t border-zinc-200 mt-6 sm:mt-8 text-center space-y-4">
            <p className="text-base sm:text-lg italic text-zinc-600">
              Interested in collaborations, commissions, or odd problems that need an odd solution?
            </p>
            <Link
              href="/contact"
              className="inline-block px-5 sm:px-7 py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-ink-900 text-white rounded hover:bg-brand-coral transition-colors duration-200"
            >
              Get in touch &rarr;
            </Link>
            <p className="text-sm sm:text-base italic text-zinc-500 mt-4">
              Want to learn how to do this?
            </p>
            <Link
              href="/teaching"
              className="inline-block px-5 sm:px-7 py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-ink-900 text-white rounded hover:bg-brand-coral transition-colors duration-200"
            >
              I offer lessons &rarr;
            </Link>
          </div>

          {/* CV / Credentials */}
          <details className="mt-8 sm:mt-12 group">
            <summary className="cursor-pointer text-sm sm:text-base font-medium text-zinc-500 hover:text-zinc-800 transition-colors select-none list-none flex items-center gap-2">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90 shrink-0"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2,1 8,5 2,9" />
              </svg>
              CV / Credentials
            </summary>
            <div className="mt-4 sm:mt-6 space-y-6 text-sm sm:text-base text-zinc-700">
              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Performance
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    30+ years of piano study; trained in classical, jazz, and
                    free improvisation.
                  </li>
                  <li>
                    Selected repertoire: Bach (French Suite No. 1), Beethoven
                    (Waldstein Sonata), Chopin (Scherzo No. 3, Ballade No. 4),
                    Ravel (Le Tombeau de Couperin), Shostakovich (Prelude &amp;
                    Fugue No. 24)
                  </li>
                  <li>
                    Classical percussion training at Brown University; concerto
                    soloist.
                  </li>
                  <li>Experience with prepared piano and live electronics.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Selected Recordings
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    2025 &ldquo;Ghostly Double&rdquo; &mdash; piano and live
                    electronics improvisation
                  </li>
                  <li>
                    2021 &ldquo;Flow&rdquo; &mdash; four-movement
                    improvisational album on texture and timbre
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">Teaching</h3>
                <p className="font-medium mb-1">
                  Workshop Leader &amp; Music Educator &mdash; San Diego
                  (2025&ndash;present)
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>
                    Group workshops in piano improvisation, musical
                    storytelling, and ear-based learning (Villa Musica,
                    AmateurPianists).
                  </li>
                  <li>
                    1:1 coaching in improvisation, listening skills, and
                    creative approaches to the keyboard.
                  </li>
                </ul>
                <p className="font-medium mb-1">
                  Interdisciplinary Teaching &mdash; Math, Music, Creativity
                  (2009&ndash;present)
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Over a decade across math, music, and creative technology,
                    including Johns Hopkins CTY summer programs.
                  </li>
                  <li>
                    Worked with children, teens, and adults in both structured
                    coursework and exploratory creative settings.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Selected Visual &amp; Generative Work
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    2025 &ldquo;Shatter&rdquo; &mdash; interactive system
                    exploring visual instability and emergent fracture patterns
                    (p5.js)
                  </li>
                  <li>
                    2024 &ldquo;Feathers&rdquo; &mdash; generative abstract
                    plumage examining organic growth through procedural
                    randomness (p5.js)
                  </li>
                  <li>
                    2024 &ldquo;Encased Melting&rdquo; &mdash; generative
                    planetary forms exploring liquidity and structure (p5.js)
                  </li>
                  <li>
                    2017 &ldquo;Fluid Subspaces&rdquo; &mdash; audiovisual
                    system mapping fluid eigenmodes to sound (C++)
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Publications
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    2017 Bridges Conference &mdash; Paper + demo on mathematical
                    visualization of fluid eigenvectors
                  </li>
                  <li>
                    2016 SIGGRAPH/Eurographics SCA (Best Paper) &mdash;
                    Compressing dynamic fluid subspaces
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-zinc-900 mb-2">Education</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    PhD Media Arts and Technology, UC Santa Barbara (2017)
                  </li>
                  <li>BA Music and Mathematics, Brown University (2009)</li>
                </ul>
              </section>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
