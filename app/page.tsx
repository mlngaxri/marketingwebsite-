import type { Metadata } from "next";
import MarketingHome from "../components/marketing/MarketingHome";
export const metadata: Metadata = { alternates: { canonical: "/" }, openGraph: { url: "/", images: [{ url: "/work/monolith-hero.webp", alt: "Monolith, a selected website design from the MotionSites portfolio" }] } };
export default function Home() { return <MarketingHome />; }
