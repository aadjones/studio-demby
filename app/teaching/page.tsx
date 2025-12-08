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
      <div className="mb-6 sm:mb-8">
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: "56.25%" }}
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
      <section className="mb-12 sm:mb-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Who This Is For</h2>
        <div className="space-y-4 text-base sm:text-lg">
          <div>
            <strong className="text-purple-700 dark:text-purple-300">
              Classical pianists:
            </strong>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              You can read Bach or Chopin, but you tighten up without a score
            </span>
          </div>
          <div>
            <strong className="text-purple-700 dark:text-purple-300">
              Creators in waiting:
            </strong>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              You want to learn how to turn the sounds in your head into music
              in your hands
            </span>
          </div>
          <div>
            <strong className="text-purple-700 dark:text-purple-300">
              Music deep divers:
            </strong>{" "}
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
        <div className="space-y-6">
          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              $45 Trial Lesson
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              One hour introductory session at my home studio in Rancho
              Peñasquitos (north San Diego)
            </p>
          </div>
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
              Ongoing Lessons
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              $90/hour, flexible scheduling
            </p>
          </div>
          <div className="border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
              Options for Ongoing Students
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Bundle packs available for those who want to commit
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 italic">
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
        </div>
      </section>

      {/* Testimonial */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 sm:p-8 border-l-4 border-indigo-500">
          <p className="text-lg sm:text-xl italic mb-4 text-gray-800 dark:text-gray-200">
            &ldquo;Aaron&apos;s improvisational skills—and his musical skills in
            general—are astounding.&rdquo;
          </p>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
            — Kyle Miller, MM (Juilliard), professional violist
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t-2 border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Free your playing today!
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3m3wZ8x2E3EeM-03IkHdX_yglrHUJ6LDSYpOjLTiprdCIqGNtl5j6IbWnzo0g5Pyw2AoiwIaGp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold text-center"
          >
            Book a Trial Lesson
          </a>
          <a
            href="mailto:aaron.demby.jones@gmail.com?subject=Piano Improvisation Lessons"
            className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-lg font-semibold text-center"
          >
            Email Me
          </a>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Have questions? Send me an email.
        </p>
      </section>
    </div>
  );
}
