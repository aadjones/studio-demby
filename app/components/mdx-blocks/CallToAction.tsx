export default function CallToAction({ email }: { email: string }) {
  return (
    <section className="my-12 sm:my-16 py-6 sm:py-8 border-t border-b text-center">
      <p className="text-base sm:text-lg italic text-zinc-700 mb-3 sm:mb-4">
      </p>
      <a
        href={`mailto:${email}`}
        className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-200"
      >
        Transmit a signal →
      </a>
    </section>
  );
}
