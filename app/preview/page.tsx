import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Portal preview", robots: { index: false, follow: false } };
export default async function Preview({searchParams}:{searchParams:Promise<{view?:string|string[]}>}) {
  const requested=(await searchParams).view;
  const views=["overview","direction","build","review","pages","analytics","seo","domains","connections","states","billing","launch","settings"];
  const view=typeof requested==="string"&&views.includes(requested)?requested:"review";
  return <main className="standalone-preview"><header><Link className="wordmark" href="/">fourthform</Link><span>Interactive preview · Edits stay on this device</span><Link href="/preview/start">Start a site ↗</Link></header><iframe src={`/portal-preview/index.html?view=${view}`} title="Fourthform client portal interactive preview" /></main>;
}
