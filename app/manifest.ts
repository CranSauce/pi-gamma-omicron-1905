import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pi Gamma Omicron Fraternity",
    short_name: "ΠΓΟ",
    description: "The official digital home and living archive of Pi Gamma Omicron Fraternity, founded in 1905.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#b5191f",
    icons: [
      {
        src: "/assets/brand/pi-gamma-omicron-crest.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
