export default function TeachingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Hero */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
          Break free from sheet music prison
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-1">
          Piano lessons emphasizing creativity and improvisation
        </p>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 italic">
          Taught by Aaron Demby Jones
        </p>
      </div>

      {/* Video */}
      <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: "50%" }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/aF_YK1nDq40?autoplay=1&mute=1&loop=1&playlist=aF_YK1nDq40"
            title="Improvisation demo | Aaron Demby Jones"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mb-12 sm:mb-16 text-center">
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3m3wZ8x2E3EeM-03IkHdX_yglrHUJ6LDSYpOjLTiprdCIqGNtl5j6IbWnzo0g5Pyw2AoiwIaGp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full hover:from-orange-500 hover:to-pink-500 transition-all text-lg sm:text-xl font-bold tracking-wider shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          BOOK A TRIAL LESSON 📅
        </a>
      </div>

      {/* What We'll Train */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          What We&apos;ll Train
        </h2>
        <div className="space-y-6 text-base sm:text-lg">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Closed Circuit Listening
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Connect your ear, mind, and hands in real time
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Orchestral Textures</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Think like a conductor: multiple voices, one instrument
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Narrative Flow</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Shape your music like a story
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Who This Is For</h2>
        <div className="space-y-4 text-base sm:text-lg">
          <div>
            <strong className="font-semibold">Classical pianists:</strong>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              You can read Bach or Chopin, but you tighten up without a score
            </span>
          </div>
          <div>
            <strong className="font-semibold">Creators in waiting:</strong>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              You want to learn how to turn the sounds in your head into music
              in your hands
            </span>
          </div>
          <div>
            <strong className="font-semibold">Music deep divers:</strong>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              You want to grasp music from the inside out, not just reenact
              what&apos;s printed on the page
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-2">$45 Trial Lesson</h3>
            <p className="text-gray-700 dark:text-gray-300">
              One hour introductory session at my home studio in Rancho
              Peñasquitos (north San Diego)
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-2">Ongoing Lessons</h3>
            <p className="text-gray-700 dark:text-gray-300">
              $90/hour, flexible scheduling
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-2">
              Options for Ongoing Students
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Bundle packs available for those who want to commit
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 italic">
            Lessons are currently in-person at my home studio. If you&apos;re
            outside San Diego, feel free to reach out—online options may be
            added in the future.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Do I need to know music theory?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Nope. We&apos;ll use sound, shape, and story before any technical
              terms.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              What if I&apos;ve never improvised before?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Perfect. This starts from zero assumptions.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Who is Aaron?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Aaron Demby Jones—I&apos;ve studied classical theory, experimented
              with electronic sound design, and played everything from Bach to
              jazz rap. With a background in teaching (and too many
              instruments), I&apos;ve spent years refining a creative approach
              to piano and music in general that I&apos;m excited to share.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 sm:p-8 border-l-4 border-blue-600">
          <p className="text-lg sm:text-xl italic mb-4 text-gray-800 dark:text-gray-200">
            &ldquo;Aaron&apos;s improvisational skills—and his musical skills in
            general—are astounding. He&apos;s a phenomenal teacher; and I think
            anyone who enjoys playing and performing music, professionally or
            otherwise, would benefit greatly from these lessons.&rdquo;
          </p>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            — Kyle Miller, MM (Juilliard), professional violist
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Free your playing today!
        </h2>
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3m3wZ8x2E3EeM-03IkHdX_yglrHUJ6LDSYpOjLTiprdCIqGNtl5j6IbWnzo0g5Pyw2AoiwIaGp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full hover:from-orange-500 hover:to-pink-500 transition-all text-lg sm:text-xl font-bold tracking-wider shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
        >
          BOOK A TRIAL LESSON 📅
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have questions?{" "}
          <a
            href="mailto:aaron.demby.jones@gmail.com?subject=Music Lessons"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Send me an email
          </a>
          .
        </p>
      </section>
    </div>
  );
}
