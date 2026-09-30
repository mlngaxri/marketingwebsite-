import type { Metadata } from "next";
export const metadata: Metadata = { title: "Portal preview", robots: { index: false, follow: false } };
import Link from "next/link";
export default function Preview() {
  return <main className="standalone-preview"><header><Link className="wordmark" href="/">fourthform</Link><span>Interactive product preview · example data</span><Link href="/preview/start">Start a website ↗</Link></header><iframe src="/portal-preview/index.html" title="Fourthform client portal interactive preview" /></main>;
}
