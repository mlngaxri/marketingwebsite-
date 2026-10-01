import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/work"].map(path=>({url:`https://fourthform-marketing.vercel.app${path}`}));
}
