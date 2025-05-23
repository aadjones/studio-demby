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
            I'm Aaron Demby Jones. I build systems that sing. Sometimes they melt. Sometimes they loop forever. 
          </p>
          <p>
            My work blends improvisation, computation, and mischief. It lives at the intersection of logic and feeling.
          </p>
          <p>
            I&rsquo;ve spent time with pianos, particles, and unstable systems. My background includes experimental music, digital art, mathematics, and computer programming—but these days, I&rsquo;m more interested in how they blur.
          </p>
          <p>
            My work is organized by clusters. You&rsquo;ll find pieces in{" "}
            <Link href="/resonant" className="text-blue-500 hover:text-blue-600 transition-colors">Resonant</Link>,{" "}
            <Link href="/errant" className="text-blue-500 hover:text-blue-600 transition-colors">Errant</Link>,{" "}
            <Link href="/fractured" className="text-blue-500 hover:text-blue-600 transition-colors">Fractured</Link>, and{" "}
            <Link href="/enclosed" className="text-blue-500 hover:text-blue-600 transition-colors">Enclosed</Link>.{" "}
            If something echoes in you,{" "}
            <a href="mailto:aaron.demby.jones@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors">reach out</a> or subscribe below for updates.
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-12">
        <GalleryOfLies prompt="Lie to me" />
      </div>
    </div>
  );
}
