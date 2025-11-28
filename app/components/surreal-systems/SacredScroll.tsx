export default function SacredScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-12 px-6 py-6 border-l-4 border-pink-600 bg-pink-50/10 rounded-md font-serif text-lg leading-relaxed tracking-wide text-pink-900 prose prose-pink">
      {children}
    </div>
  );
}
