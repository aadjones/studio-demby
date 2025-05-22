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
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Subscribe
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-2 text-center">
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