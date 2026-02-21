"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjbberq";

const INQUIRY_OPTIONS = [
  { value: "music", label: "Music — performance, workshop, or collaboration" },
  { value: "art", label: "Visual Art — commission, print, or installation" },
  { value: "teaching", label: "Teaching — lessons, workshop, or custom tools" },
  { value: "other", label: "Something else" },
];

const inputClass =
  "w-full px-3 py-2 border border-zinc-300 rounded text-ink-900 text-sm sm:text-base bg-white focus:outline-none focus:border-ink-900 transition-colors";

function Form() {
  const searchParams = useSearchParams();
  const defaultInquiry = searchParams.get("inquiry") ?? "music";

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-2xl font-bold text-ink-900 mb-3">
          Message sent.
        </p>
        <p className="text-ink-500">
          Thanks—I&apos;ll get back to you within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, catches bots */}
      <input type="text" name="_gotcha" className="hidden" />

      <div>
        <label
          htmlFor="inquiry"
          className="block text-sm font-medium text-ink-700 mb-1.5"
        >
          What&apos;s this about?
        </label>
        <select
          id="inquiry"
          name="inquiry"
          defaultValue={defaultInquiry}
          className={inputClass}
        >
          {INQUIRY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-ink-700 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-brand-rose">
          Something went wrong — please try again or email{" "}
          <a href="mailto:aaron.demby.jones@gmail.com" className="underline">
            directly
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-7 py-3 text-base font-display font-semibold bg-ink-900 text-white rounded hover:bg-brand-coral transition-colors duration-200 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
