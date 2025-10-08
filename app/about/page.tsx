import Image from "next/image";
import Link from "next/link";
import Whisper from "@/app/components/mdx-blocks/Whisper";
import GalleryOfLies from "@/app/components/surreal-systems/GalleryOfLies";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">About Me</h1>
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
            I&rsquo;m Aaron Demby Jones. I improvise, build tools, write things down when they bother me, and teach.
          </p>
          <p>
            <strong>Music:</strong> Piano since age 5, from classical to free improvisation. Also drums, violin, guitar. I&rsquo;ve recorded albums and work with digital audio synthesis.
          </p>
          <p>
            <strong>Visual Art:</strong> Inspired by generative systems and built from creative coding tools like p5.js.
          </p>
          <p>
            <strong>Tools:</strong> I like to tinker to try to create solutions to niche problems—like hacking iPhone shortcuts into Rube Goldberg machines. If a tool seems like it might help others, I flesh it out and share it with the world.
          </p>
          <p>
            <strong>Writing:</strong> Analytical takes, weird observations, occasional jokes. I think about structure a lot.
          </p>
          <p>
            <strong>Teaching:</strong> Math, piano, and chess, mostly. My philosophy is rooted in play and exploration.
          </p>
          <p>
            The work here often crosses categories:{" "}
            <Link href="/sound-vision" className="text-blue-500 hover:text-blue-600 transition-colors">Sound & Vision</Link>,{" "}
            <Link href="/systems-tools" className="text-blue-500 hover:text-blue-600 transition-colors">Systems & Tools</Link>,{" "}
            <Link href="/provocations" className="text-blue-500 hover:text-blue-600 transition-colors">Provocations</Link>,{" "}
            <Link href="/practice-pedagogy" className="text-blue-500 hover:text-blue-600 transition-colors">Practice & Pedagogy</Link>.
          </p>
          <p className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
            Open to collaborations, commissions, and interesting projects. Reach out if you want to work together:{" "}
            <a
              href="mailto:aaron.demby.jones@gmail.com"
              className="text-blue-500 hover:text-blue-600 transition-colors underline"
            >
              aaron.demby.jones@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-12">
        <GalleryOfLies prompt="Lie to me" />
      </div>
    </div>
  );
}
