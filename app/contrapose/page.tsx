import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contrapose - Practice at New Angles",
  description:
    "Break through practice plateaus with creative constraints for piano. 73 professionally designed practice cards for focused practice and improvisation.",
  openGraph: {
    title: "Contrapose - Practice at New Angles",
    description:
      "Break through practice plateaus with creative constraints for piano.",
    type: "website",
  },
};

export default function ContraposeMarketingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-9xl font-extrabold mb-3 text-gray-900 dark:text-gray-100 tracking-tight">
            Contrapose
          </h1>
          <p className="text-xl md:text-2xl text-violet-600 dark:text-violet-400 font-medium mb-6 tracking-wide">
            <span className="font-mono font-bold">73</span> Cards for Piano Practice
          </p>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Break through practice plateaus with creative constraints.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-600">
            Coming soon to the App Store
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Two Practice Modes
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* General Practice Card */}
            <div className="group bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/10 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(124,58,237,0.12)]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                General Practice
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Mindful prompts for focused, intentional practice sessions
              </p>
            </div>

            {/* Improvisation Card */}
            <div className="group bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-950/10 rounded-lg p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(234,88,12,0.12)]">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Improvisation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Creative constraints to spark exploration and discovery
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-12 py-12">
          <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-center text-base md:text-lg text-gray-600 dark:text-gray-400">
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              No ads
            </span>
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              No subscriptions
            </span>
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              Free
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="mt-32 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-center gap-12 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/contrapose/support"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/contrapose/privacy"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Privacy
            </Link>
          </div>
          <p className="text-center mt-4 text-gray-500 dark:text-gray-600 text-sm">
            © 2025 Studio Demby
          </p>
        </footer>
      </main>
    </div>
  );
}
