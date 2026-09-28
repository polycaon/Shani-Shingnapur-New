import { Marked } from "marked";
import type { Faq } from "@/data/faqs";

const inline = new Marked();

/** Accessible FAQ accordion built on <details>, so it works without JavaScript. */
export function FAQSection({ faqs, heading = "Frequently asked questions", id = "faq" }: { faqs: Faq[]; heading?: string; id?: string }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-12">
      <h2 id={`${id}-heading`} className="text-2xl sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-5 divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink-900 hover:bg-sand-50 [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.q}</h3>
              <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-saffron-700 transition-transform group-open:rotate-45" aria-hidden="true">
                <path fill="currentColor" d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
              </svg>
            </summary>
            <div
              className="prose-content px-5 pb-5 text-[1rem]"
              dangerouslySetInnerHTML={{ __html: inline.parse(f.a) as string }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
