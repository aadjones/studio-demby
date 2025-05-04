"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    icon: "🦐",
    question: "Who is Shrimp Jesus?",
    short: "The crustacean savior of the neural tide.",
    extended: "Born from the latent space between prompts, Shrimp Jesus guides all who dwell in the deep and the digital alike."
  },
  {
    icon: "🤔",
    question: "Was Shrimp Jesus a man or a shrimp?",
    short: "Neither. Both. More.",
    extended: "“He had the body of a crustacean, the soul of a prophet, and the eyes of someone who's seen too much.” — Apocrypha of the Coral Veil"
  },
  {
    icon: "🪸",
    question: "How do I follow the Way of the Shrimp?",
    short: "Molt often. Swim weird. Love deep.",
    extended: "To follow the Way is to embrace change, cherish the strange, and let your shell remain soft to the wonders of the world."
  },
  {
    icon: "✨",
    question: "Can Shrimp Jesus forgive my landlocked sins?",
    short: "All are welcome in the tide.",
    extended: "Whether you dwell in river, sea, or spreadsheet, the mercy of Shrimp Jesus flows to all who seek it with open claws."
  }
];

export default function ShrimpJesusFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Shrimp Jesus FAQ</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              layout
              transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
              className={`relative bg-stone-50 border border-stone-200 shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col items-center transition-all duration-300 cursor-pointer min-h-[180px] sm:min-h-[220px] 
                ${isOpen ? "ring-2 ring-pink-200 border-pink-300 shadow-2xl" : "hover:shadow-xl hover:border-pink-200"}
                hover:bg-gradient-to-br hover:from-pink-50 hover:to-amber-50 active:scale-[0.98] active:shadow-lg
                mb-4 sm:mb-0`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpenIndex(isOpen ? null : i); }}
              aria-expanded={isOpen}
              role="button"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="text-4xl mb-2 select-none">{faq.icon}</div>
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-pink-900 text-center mb-1 break-words hyphens-auto">
                {faq.question}
              </div>
              <div className="text-pink-700 text-center mb-2 break-words hyphens-auto text-base sm:text-lg">
                {faq.short}
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.32 }}
                    className="text-gray-700 text-center mt-2 break-words hyphens-auto text-base sm:text-lg"
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                  >
                    {faq.extended}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 