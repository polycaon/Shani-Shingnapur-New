import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1b2338" }}>
        <svg width="150" height="150" viewBox="0 0 48 48">
          <ellipse cx="24" cy="15" rx="11" ry="3.2" fill="none" stroke="#e6c77a" strokeWidth="1.6" />
          <circle cx="24" cy="15" r="4.2" fill="#e6c77a" />
          <path d="M19.5 37V24.5c0-2.6 2-4.5 4.5-4.5s4.5 1.9 4.5 4.5V37z" fill="#0b0f1a" stroke="#e07a1f" strokeWidth="1.2" />
          <rect x="12" y="37" width="24" height="3.2" rx="1" fill="#e07a1f" />
        </svg>
      </div>
    ),
    size,
  );
}
