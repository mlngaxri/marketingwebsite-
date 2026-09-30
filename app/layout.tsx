import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400.css";
import "./tokens.css";
import "./globals.css";
import "./product.css";
import "./marketing.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fourthform-marketing.vercel.app/"),
  title: { default: "Fourthform — Websites, brought into form.", template: "%s — Fourthform" },
  description: "A considered website, shaped with you. Explore Fourthform’s design process, client portal and ongoing website care.",
  openGraph: { title: "Fourthform — Websites, brought into form.", description: "A considered website, shaped with you.", type: "website", locale: "en_AU" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
