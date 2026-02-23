interface Props {
  href: string;
  label?: string;
}

export default function LaunchExperience({ href, label = "Open Experience" }: Props) {
  return (
    <div className="w-full my-10 flex flex-col items-center gap-2">
      <a
        href={href}
        className="inline-flex items-center gap-2 px-8 py-4 bg-ink-900 !text-white no-underline hover:bg-brand-coral transition-colors duration-200 rounded font-medium text-base"
      >
        {label} &rarr;
      </a>
      <p className="text-xs text-zinc-400 font-mono m-0">full-screen interactive</p>
    </div>
  );
}
