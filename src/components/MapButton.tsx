import { templeInfo } from "@/data/temple";

export function MapButton({ label = "View location on Google Maps", directions = false }: { label?: string; directions?: boolean }) {
  return (
    <a
      className="btn btn-dark"
      href={directions ? templeInfo.directionsUrl : templeInfo.mapUrl}
      target="_blank"
      rel="noopener"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M10 1.5a6 6 0 0 0-6 6c0 4.4 6 11 6 11s6-6.6 6-11a6 6 0 0 0-6-6Zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
      </svg>
      {label}
      <span className="sr-only"> (opens Google Maps in a new tab)</span>
    </a>
  );
}
