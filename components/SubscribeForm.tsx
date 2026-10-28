'use client'

export function SubscribeForm() {
  return (
    <>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/studiodemby"
        method="post"
        target="popupwindow"
        onSubmit={() => {
          window.open('https://buttondown.email/studiodemby', 'popupwindow')
        }}
        className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full"
      >
        <input
          type="email"
          name="email"
          id="bd-email"
          placeholder="you@domain.com"
          required
          className="w-full sm:flex-1 px-4 py-2 border border-ink-300 rounded-md min-w-0"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-coral transition-colors"
        >
          Subscribe
        </button>
      </form>
      <p className="text-sm text-ink-500 mt-2 text-center">
        <a
          href="https://buttondown.email/refer/studiodemby"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Powered by Buttondown
        </a>
      </p>
    </>
  )
} 