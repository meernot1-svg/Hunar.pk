import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hunar.pk — Pakistan's Biggest Local Freelancing Network",
    short_name: "Hunar.pk",
    description:
      "Pakistan's biggest local freelancing network. Hire workers or post kaam — all in PKR.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    orientation: "portrait",
    icons: [
      {
        src: "/hunar-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "shopping"],
  };
}
