import Image from "next/image";
import Link from "next/link";

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
            all a form of improvisation.
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

          <div className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              Start Here
            </h2>
            <p className="mb-3 text-gray-600">A few good doors into my work:</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/activity/move-to-in-progress"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Move to &lsquo;In Progress&rsquo;
                </Link>{" "}
                — a task system that plays back.
              </li>
              <li>
                <Link
                  href="/featured/ghostly-double"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Ghostly Double
                </Link>{" "}
                — piano + electronics improvisation with a phantom duet.
              </li>
              <li>
                <Link
                  href="/featured/frogmath"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  FrogMath
                </Link>{" "}
                — number theory reimagined with frogs and lily pads.
              </li>
              <li>
                <Link
                  href="/featured/feathers"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Feathers
                </Link>{" "}
                — generative plumage.
              </li>
            </ul>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6 space-y-3">
            <p>
              If you&rsquo;re interested in collaborations, commissions, or odd
              problems that need an odd solution, reach out:{" "}
              <a
                href="mailto:aaron.demby.jones@gmail.com"
                className="text-blue-500 hover:text-blue-600 transition-colors underline"
              >
                aaron.demby.jones@gmail.com
              </a>
            </p>
            <p>
              I also teach music lessons focusing on creativity and
              exploration—learn more{" "}
              <Link
                href="/teaching"
                className="text-blue-500 hover:text-blue-600 transition-colors underline"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
