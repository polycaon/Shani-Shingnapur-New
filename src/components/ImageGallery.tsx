import Link from "next/link";
import Image from "next/image";
import { gallerySections } from "@/data/gallery";

export function ImageGallery() {
  return (
    <div className="not-prose space-y-10">
      {gallerySections.map((s) => (
        <section key={s.id} aria-labelledby={`g-${s.id}`}>
          <h2 id={`g-${s.id}`} className="text-2xl">
            {s.title}
          </h2>
          <p className="mt-1 text-ink-700">{s.description}</p>
          {s.images.length ? (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.images.map((img) => (
                <li key={img.src}>
                  <figure className="card overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="h-auto w-full"
                      loading="lazy"
                    />
                    <figcaption className="p-3 text-sm">
                      {img.caption}
                      <span className="mt-1 block text-xs text-ink-600">
                        Photo: {img.credit} ·{" "}
                        {img.licenceUrl ? (
                          <a href={img.licenceUrl} target="_blank" rel="noopener">
                            {img.licence}
                          </a>
                        ) : (
                          img.licence
                        )}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-sand-300 bg-white p-4 text-sm text-ink-600">
              We are collecting original and properly licensed photographs for this section. If you have photos you are
              willing to share with credit, please <Link href="/contact/">contact us</Link>.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
