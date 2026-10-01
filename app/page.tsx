import type { Metadata } from "next";
import MarketingHome from "../components/marketing/MarketingHome";
export const metadata: Metadata = { alternates: { canonical: "/" }, openGraph: { url: "/", images: [{ url: "/marketing/mori-interior.webp", alt: "Mori House — a Fourthform website concept" }] } };
export default function Home() { return <MarketingHome />; }
