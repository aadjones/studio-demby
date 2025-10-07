import Link from 'next/link';

export const metadata = {
  title: 'Contrapose Support',
  description: 'Get help with Contrapose, request new cards, and find answers to common questions.',
};

export default function ContraposeSupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">Contrapose Support</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
        <p>Email: <a href="mailto:aaron.demby.jones@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">aaron.demby.jones@gmail.com</a></p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Request a Card</h2>
        <p>Have an idea for a new practice prompt? <a href="https://docs.google.com/forms/d/e/1FAIpQLSdzOwEXaYVf_UT2h9x0UE3y70z0hXSTx4qwLhL1GoA1RMDWLQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">Submit your suggestion here</a></p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Privacy</h2>
        <p>See our <Link href="/contrapose/privacy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link></p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <p className="font-semibold">Q: How does the intelligent card rotation work?</p>
            <p className="mt-2">A: The app tracks which practice areas you haven&apos;t worked on recently and prioritizes those.</p>
          </div>

          <div>
            <p className="font-semibold">Q: Can I add custom cards?</p>
            <p className="mt-2">A: Not yet, but you can request new cards through the form linked above!</p>
          </div>

          <div>
            <p className="font-semibold">Q: Does this work offline?</p>
            <p className="mt-2">A: Yes! All cards are stored locally on your device.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
