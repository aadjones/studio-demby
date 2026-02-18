import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/content/projects-loader";
import { MDXProject } from "@/types/mdx";

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

export default async function ContraposeMarketingPage() {
  // Get prev/next projects for navigation
  const allProjects: MDXProject[] = await getAllProjects();
  const sortedProjects = [...allProjects]
    .filter((p) => p.date)
    .sort((a, b) => {
      const dateA = new Date(a.date!).getTime();
      const dateB = new Date(b.date!).getTime();
      return dateB - dateA;
    });

  const currentIndex = sortedProjects.findIndex((p) => p.slug === "contrapose");
  const totalProjects = sortedProjects.length;

  const previousProject =
    currentIndex >= 0
      ? sortedProjects[(currentIndex - 1 + totalProjects) % totalProjects]
      : undefined;
  const nextProject =
    currentIndex >= 0
      ? sortedProjects[(currentIndex + 1) % totalProjects]
      : undefined;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <Link
            href="/practice-pedagogy"
            className="hover:text-purple-600 transition-colors"
          >
            Practice &amp; Pedagogy
          </Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">Contrapose</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-3 text-gray-900 tracking-tight">
            Contrapose
          </h1>
          <p className="text-xl md:text-2xl text-violet-600 font-medium mb-6 tracking-wide">
            <span className="font-mono font-bold">73</span> Cards for Piano Practice
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Break through practice plateaus with creative constraints.
          </p>
          <a
            href="https://apps.apple.com/us/app/id6753694877"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Download on the App Store
          </a>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Two Practice Modes
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* General Practice Card */}
            <div className="group bg-gradient-to-br from-white to-violet-50/30/10 rounded-lg p-8 border border-gray-200 shadow-sm hover:border-violet-400 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(124,58,237,0.12)]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                General Practice
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mindful prompts for focused, intentional practice sessions
              </p>
            </div>

            {/* Improvisation Card */}
            <div className="group bg-gradient-to-br from-white to-orange-50/30/10 rounded-lg p-8 border border-gray-200 shadow-sm hover:border-orange-400 transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(234,88,12,0.12)]">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Improvisation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Creative constraints to spark exploration and discovery
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-12 py-12">
          <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-center text-base md:text-lg text-gray-600">
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

        {/* Project Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            {previousProject ? (
              <Link
                href={`/featured/${previousProject.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <span>←</span>
                <span>Previous</span>
              </Link>
            ) : (
              <div className="text-gray-300">
                <span>← Previous</span>
              </div>
            )}

            {nextProject ? (
              <Link
                href={`/featured/${nextProject.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <span>Next</span>
                <span>→</span>
              </Link>
            ) : (
              <div className="text-gray-300">
                <span>Next →</span>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Links */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-center gap-12 text-sm text-gray-600">
            <Link
              href="/projects/contrapose/support"
              className="hover:text-purple-600 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/projects/contrapose/privacy"
              className="hover:text-purple-600 transition-colors"
            >
              Privacy
            </Link>
          </div>
          <p className="text-center mt-4 text-gray-500 text-sm">
            © 2025 Studio Demby
          </p>
        </footer>
      </main>
    </div>
  );
}
