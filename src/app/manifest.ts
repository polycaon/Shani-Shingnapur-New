import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Shani Shingnapur",
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#fcf9f3",
    theme_color: "#1b2338",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
