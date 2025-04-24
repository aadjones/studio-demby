import Image from "next/image";
import Link from "next/link";
import Whisper from "@/app/components/mdx-blocks/Whisper";
import GalleryOfLies from "@/app/components/surreal-systems/GalleryOfLies";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>
      <Image
        src="/photos/about/profile.png" // Make sure the image is inside the public/ folder
        alt="Aaron Demby Jones"
        width={200}
        height={200}
        className="rounded-full mb-4"
      />
      <p className="text-lg mb-4">
        I build systems that sing. Sometimes they melt. Sometimes they loop forever. 
      </p>
      <p className="text-lg mb-4">
        My work blends improvisation, computation, and mischief. It lives at the intersection of logic and feeling.
      </p>
      <p className="text-lg mb-4">
        I&rsquo;ve spent time with pianos, particles, and unstable systems. My background includes experimental music, digital art, mathematics, and computer programming—but these days, I&rsquo;m more interested in how they blur.
      </p>
      <p className="text-lg mb-4">
        My work is organized by clusters. You&rsquo;ll find pieces in <Link href="/resonant" className="text-blue-500">Resonant</Link>, <Link href="/errant" className="text-blue-500">Errant</Link>, <Link href="/fractured" className="text-blue-500">Fractured</Link>, and <Link href="/enclosed" className="text-blue-500">Enclosed</Link>. If something echoes in you, <a href="mailto:aaron.demby.jones@gmail.com" className="text-blue-500">reach out</a>.
      </p>
      <div className="flex items-center gap-2 text-lg mb-4">
  <GalleryOfLies prompt="Lie to me" />
</div>

    </div>
  );
}
