import Image from "next/image";
import Link from "next/link";
import Whisper from "@/app/components/mdx-blocks/Whisper";
import GalleryOfLies from "@/app/components/surreal-systems/GalleryOfLies";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">About Me</h1>
      <div className="flex flex-col items-center sm:items-start">
        <Image
          src="/photos/about/profile.png"
          alt="Aaron Demby Jones"
          width={160}
          height={160}
          className="rounded-full mb-6 sm:mb-8 w-[160px] sm:w-[200px] h-[160px] sm:h-[200px]"
        />
        <div className="space-y-4 text-base sm:text-lg">
          <p>
            I build systems that sing. Sometimes they melt. Sometimes they loop forever. 
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
            <a href="mailto:aaron.demby.jones@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors">reach out</a>.
          </p>
        </div>
      </div>
      <div className="mt-8 sm:mt-12">
        <GalleryOfLies prompt="Lie to me" />
      </div>
    </div>
  );
}
