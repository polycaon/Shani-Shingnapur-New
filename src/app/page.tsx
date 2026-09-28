import Link from "next/link";
import { staticRoutes } from "@/lib/routes";
import { buildMetadata, faqSchema, templeSchema } from "@/lib/seo";
import { templeInfo, timings } from "@/data/temple";
import { getOrigin, formatRange, formatHours } from "@/data/travel";
import { faqData, faqGroups } from "@/data/faqs";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/JsonLd";
import { QuickInfoCard } from "@/components/TempleData";
import { DistanceTable } from "@/components/TravelData";
import { FestivalList } from "@/components/FestivalList";
import { FAQSection } from "@/components/FAQSection";
import { CardGrid } from "@/components/CardGrid";
import { MapButton } from "@/components/MapButton";
import { VerificationBadge } from "@/components/VerificationBadge";
import { cardFor } from "@/components/ContentRenderer";

const home = staticRoutes.find((r) => r.url === "/")!;
export const metadata = buildMetadata({ url: "/", title: home.title, description: home.description });

function HeroArt() {
  // Original decorative illustration: the open-air platform beneath an open sky and Saturn's ring.
  return (
    <svg viewBox="0 0 360 300" className="h-auto w-full" role="img" aria-labelledby="hero-art-title">
      <title id="hero-art-title">Illustration of a dark stone on an open platform under the evening sky</title>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2338" />
          <stop offset="0.65" stopColor="#2a3452" />
          <stop offset="1" stopColor="#c75d0e" />
        </linearGradient>
      </defs>
      <rect width="360" height="300" rx="24" fill="url(#sky)" />
      <g opacity="0.8" fill="#e6c77a">
        <circle cx="40" cy="40" r="1.4" />
        <circle cx="96" cy="70" r="1" />
        <circle cx="300" cy="36" r="1.6" />
        <circle cx="330" cy="100" r="1" />
        <circle cx="210" cy="26" r="1.1" />
        <circle cx="150" cy="54" r="0.9" />
      </g>
      <g transform="translate(262 78)">
        <ellipse rx="34" ry="9" fill="none" stroke="#e6c77a" strokeWidth="2.5" transform="rotate(-18)" />
        <circle r="15" fill="#e6c77a" />
        <path d="M-32 6a34 9 0 0 0 64-18" fill="none" stroke="#e6c77a" strokeWidth="2.5" transform="rotate(-18)" />
      </g>
      <path d="M0 250 Q90 228 180 238 T360 232 V300 H0Z" fill="#843a0f" opacity="0.55" />
      <rect x="110" y="222" width="140" height="14" rx="3" fill="#dccaa6" />
      <rect x="96" y="236" width="168" height="16" rx="3" fill="#b98b2b" />
      <rect x="82" y="252" width="196" height="18" rx="3" fill="#7c5b17" />
      <path d="M160 222V150c0-12 9-22 20-22s20 10 20 22v72z" fill="#0b0f1a" stroke="#e07a1f" strokeWidth="2" />
      <path d="M170 150c3-8 8-12 10-12" stroke="#2a3452" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const quickAnswers = [
  {
    q: "Where is it?",
    a: `${templeInfo.village}, ${templeInfo.taluka} taluka, ${templeInfo.district} district, ${templeInfo.state}.`,
    href: "/temple/",
  },
  { q: "Temple timings?", a: "Reported open for most of the day — confirm current hours before travelling.", href: "/temple/timings/" },
  { q: "How to reach?", a: "By road. Nearest stations: Rahuri & Ahilyanagar. Nearest airports: Shirdi & Chh. Sambhajinagar.", href: "/travel/how-to-reach/" },
  {
    q: "Distance from Shirdi?",
    a: `Roughly ${formatRange(getOrigin("shirdi")!.distanceKm, "km").replace("about ", "")} by road — ${formatHours(getOrigin("shirdi")!.driveHours)} each way.`,
    href: "/distance/shirdi-to-shani-shingnapur/",
  },
  { q: "Before you visit?", a: "Avoid Saturday crowds if you can, dress modestly and carry water.", href: "/blog/things-to-know-before-visiting-shani-shingnapur/" },
  { q: "What else is nearby?", a: "Shirdi, Nashik, Trimbakeshwar, Ellora and Grishneshwar.", href: "/nearby-places/" },
];

export default function HomePage() {
  const faqs = faqGroups.home.map((k) => faqData[k]);
  return (
    <>
      <JsonLd data={[templeSchema(), faqSchema(faqs)]} />

      {/* Hero — compact so practical information is visible above the fold. */}
      <section className="border-b border-sand-200 bg-gradient-to-b from-sand-100 via-sand-50 to-sand-50">
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="eyebrow">Independent guide · {templeInfo.district}, {templeInfo.state}</p>
            <h1 className="mt-3 text-balance text-[2rem] leading-tight text-ink-900 sm:text-5xl">
              Shani Shingnapur Temple – History, Timings, Darshan &amp; Travel Guide
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-700">
              A comprehensive guide to Shani Shingnapur Temple in Maharashtra, including temple information, history,
              darshan guidance, travel information, nearby places, festivals and pilgrimage tips.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link href="/temple/" className="btn btn-primary">
                Explore Temple Guide
              </Link>
              <Link href="/travel/how-to-reach/" className="btn btn-outline">
                How to Reach
              </Link>
              <Link href="/temple/timings/" className="btn btn-outline">
                Temple Timings
              </Link>
              <Link href="/nearby-places/" className="btn btn-outline">
                Nearby Places
              </Link>
            </div>
          </div>
          <div className="mx-auto hidden w-full max-w-sm overflow-hidden rounded-3xl sm:block">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* Six most-asked questions, answered immediately. */}
      <section aria-label="Quick answers" className="container-page -mt-px py-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickAnswers.map((x) => (
            <li key={x.q}>
              <Link href={x.href} className="card card-link h-full p-4">
                <span className="block text-sm font-bold text-saffron-700">{x.q}</span>
                <span className="mt-1 block text-[0.95rem] text-ink-800">{x.a}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="container-page space-y-16 pb-8">
        <section aria-labelledby="about" className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-content">
            <h2 id="about" className="!mt-0">About Shani Shingnapur Temple</h2>
            <p>
              <strong>Shani Shingnapur</strong> is a village in {templeInfo.taluka} taluka of {templeInfo.district} district
              (formerly {templeInfo.districtFormerName}) in {templeInfo.state}, about 35 km north-east of Ahilyanagar city.
              It is home to one of India&apos;s best-known shrines to <Link href="/shani-dev/">Shani Dev</Link>, the deity
              associated with the planet Saturn, and draws pilgrims from across the country — especially on Saturdays.
            </p>
            <p>
              What makes the temple unusual is its form. There is no sanctum, roof or enclosing wall around the deity. Shani
              Dev is worshipped as a tall, dark, self-manifested (<em>swayambhu</em>) stone standing on an open, raised
              platform. According to local tradition, the deity wished to remain under the open sky, which is why the shrine
              has never been roofed.
            </p>
            <h3>Why Shani Shingnapur is famous</h3>
            <ul>
              <li>
                <strong>The open-air shrine</strong> — a rare form of temple where the deity stands exposed to sun and rain.
              </li>
              <li>
                <strong>The village without doors</strong> — houses traditionally have door frames but no locking doors,
                reflecting the belief that Shani Dev protects the village.{" "}
                <Link href="/blog/shani-shingnapur-village-without-doors/">Read about the tradition</Link>.
              </li>
              <li>
                <strong>Shani worship</strong> — devotees come to offer oil and prayers, particularly on Saturdays, Shani
                Amavasya and <Link href="/festivals/shani-jayanti/">Shani Jayanti</Link>.
              </li>
              <li>
                <strong>Its place on the Shirdi circuit</strong> — many pilgrims visiting Shirdi&apos;s Sai Baba temple
                also travel to Shingnapur the same day.
              </li>
            </ul>
            <p>
              <Link href="/temple/">Read the full temple overview →</Link>
            </p>
          </div>
          <div className="space-y-4">
            <QuickInfoCard compact />
            <div className="flex flex-wrap gap-3">
              <MapButton label="View location" />
            </div>
          </div>
        </section>

        <section aria-labelledby="timings" className="grid gap-8 lg:grid-cols-2">
          <div className="prose-content">
            <h2 id="timings" className="!mt-0">Temple Timings &amp; Darshan</h2>
            <p>
              Published sources disagree on the exact hours. Several guides describe the shrine as open for darshan for most
              of the day, with aartis in the early morning and around sunset. We are still confirming a current schedule
              with the temple trust, so we show what is reported and label it clearly.
            </p>
            <p className="callout callout-warning !text-[0.98rem]">
              <strong>Timings and temple procedures may change.</strong> Visitors should verify current arrangements before
              travelling.
            </p>
            <p>
              Darshan here is simple: devotees queue, approach the platform, offer prayers — often with oil — and move on.
              On weekdays this can take under an hour; on Saturdays and festival days, allow much longer.
            </p>
            <p>
              <Link href="/temple/timings/">Timings in detail</Link> · <Link href="/temple/darshan/">Darshan guide</Link> ·{" "}
              <Link href="/temple/pooja/">Pooja &amp; worship</Link>
            </p>
          </div>
          <div className="card self-start p-5">
            <p className="font-semibold text-ink-900">What is reported</p>
            <ul className="mt-3 divide-y divide-sand-100">
              {timings.rows.slice(0, 4).map((r) => (
                <li key={r.label} className="flex flex-wrap items-start justify-between gap-2 py-2.5 text-[0.95rem]">
                  <span>
                    <span className="block font-semibold">{r.label}</span>
                    <span className="text-ink-700">{r.value}</span>
                  </span>
                  <VerificationBadge status={r.status} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-600">
              For confirmed hours, check the{" "}
              <a href={templeInfo.officialWebsite.value} target="_blank" rel="noopener">
                temple trust&apos;s website<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="history" className="prose-content">
          <h2 id="history">Shani Shingnapur History</h2>
          <p>
            Much of Shingnapur&apos;s early history survives as oral tradition rather than written record. The best-known
            account tells of a black stone slab washed up near the village after heavy rain and floods. When local herders
            touched it with a stick, the story goes, the stone bled — and that night Shani Dev appeared in a dream to a
            villager, asking to be installed in the village without a roof over him.
          </p>
          <p>
            Documented history is more recent: the shrine is managed by the {templeInfo.trust.value}; the village&apos;s
            door-free tradition drew national attention when a bank opened a &quot;lockless&quot; branch there in 2011; and
            in April 2016, following a Bombay High Court direction, the trust opened the platform to all devotees, women
            included.
          </p>
          <p>
            <Link href="/temple/history/">Read the full history, with tradition and documented events kept separate →</Link>
          </p>
        </section>

        <section aria-labelledby="reach">
          <div className="prose-content">
            <h2 id="reach">How to Reach Shani Shingnapur</h2>
            <p>
              Shani Shingnapur has no railway station or airport of its own, so every journey ends by road. The closest
              railway stations are <strong>Rahuri</strong> and <strong>Ahilyanagar (Ahmednagar)</strong>, both roughly
              30–35 km away. The closest airports are <strong>Shirdi</strong> and{" "}
              <strong>Chhatrapati Sambhajinagar</strong>. Taxis, MSRTC buses and shared jeeps cover the last stretch.
            </p>
          </div>
          <div className="mt-6">
            <DistanceTable />
          </div>
          <p className="mt-4 flex flex-wrap gap-3">
            <Link href="/travel/how-to-reach/" className="btn btn-primary">
              Complete how-to-reach guide
            </Link>
            <Link href="/distance/" className="btn btn-outline">
              Distance calculator
            </Link>
          </p>
        </section>

        <section aria-labelledby="shirdi" className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-content">
            <h2 id="shirdi" className="!mt-0">Shani Shingnapur from Shirdi</h2>
            <p>
              Shani Shingnapur is {formatRange(getOrigin("shirdi")!.distanceKm, "km")} from Shirdi by road — usually{" "}
              {formatHours(getOrigin("shirdi")!.driveHours)} each way. That makes it one of the most popular side trips for
              pilgrims visiting the Sai Baba Samadhi Mandir, and a half-day or full-day round trip is easy to arrange.
            </p>
            <p>
              Most travellers go by taxi or with a hired car; MSRTC buses and shared jeeps are cheaper but slower. If you
              want to combine both temples in a single day, start early and keep Saturday crowds in mind.
            </p>
          </div>
          <div className="self-start">
            <CardGrid
              columns={2}
              items={[
                "/travel/from-shirdi/",
                "/pilgrimage/shirdi-shani-shingnapur-one-day-trip/",
                "/pilgrimage/shirdi-shani-shingnapur-two-day-itinerary/",
                "/nearby-places/shirdi/",
              ].map(cardFor)}
            />
          </div>
        </section>

        <section aria-labelledby="festivals">
          <div className="prose-content">
            <h2 id="festivals">Festivals &amp; Important Days</h2>
            <p>
              Saturday is Shani Dev&apos;s day, so every week has its own peak. The year&apos;s biggest occasions are Shani
              Jayanti and any Amavasya (new moon) that falls on a Saturday. Lunar dates change every year — see the{" "}
              <Link href="/festivals/festival-calendar/">festival calendar</Link> for calculated dates.
            </p>
          </div>
          <div className="mt-6">
            <FestivalList />
          </div>
        </section>

        <section aria-labelledby="nearby">
          <div className="prose-content">
            <h2 id="nearby">Nearby Places</h2>
            <p>
              Shingnapur sits at the centre of one of Maharashtra&apos;s busiest pilgrimage regions. These are the places
              most often combined with a visit — each has its own guide with distances and suggested time.
            </p>
          </div>
          <div className="mt-6">
            <CardGrid
              items={[
                "/nearby-places/shirdi/",
                "/nearby-places/nashik/",
                "/nearby-places/trimbakeshwar/",
                "/nearby-places/chhatrapati-sambhajinagar/",
                "/nearby-places/ahmednagar/",
                "/pilgrimage/maharashtra-temple-tour/",
              ].map(cardFor)}
            />
          </div>
        </section>

        <section aria-labelledby="tips" className="prose-content">
          <h2 id="tips">Travel Tips</h2>
          <ul>
            <li>
              <strong>Go early on a weekday</strong> if you want a calm darshan. Saturdays, Shani Amavasya and Shani Jayanti
              are the busiest days.
            </li>
            <li>
              <strong>Dress modestly and comfortably.</strong> Expect to stand in the sun; carry water and a cap, and
              follow any instructions given at the shrine.
            </li>
            <li>
              <strong>Buy offerings from shops that show prices clearly</strong>, and be wary of anyone offering paid
              &quot;VIP&quot; access without an official receipt.
            </li>
            <li>
              <strong>Agree taxi terms before you set off</strong> — route, waiting time and total cost.
            </li>
            <li>
              <strong>Avoid the midday heat from March to May</strong>; October to February is the most comfortable
              season.
            </li>
          </ul>
          <p>
            <Link href="/travel/travel-tips/">More travel tips</Link> ·{" "}
            <Link href="/blog/best-time-to-visit-shani-shingnapur/">Best time to visit</Link> ·{" "}
            <Link href="/plan-your-visit/">Plan your visit</Link>
          </p>
        </section>

        <FAQSection faqs={faqs} heading="Frequently Asked Questions" />

        <aside className="rounded-2xl border border-sand-200 bg-white p-5 text-sm text-ink-700">
          <strong className="text-ink-900">About this website:</strong> {siteConfig.independentNotice}{" "}
          Learn more <Link href="/about/">about who we are</Link> and <Link href="/editorial-policy/">how we check information</Link>.
        </aside>
      </div>
    </>
  );
}
