import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Le Glaude",
  description: "Le Glaude se connecte à l'univers pour répondre à toutes vos questions.",
  openGraph: {
    title: "Le Glaude",
    description: "Le Glaude se connecte à l'univers pour répondre à toutes vos questions.",
    siteName: "Le Glaude",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Glaude",
    description: "Le Glaude se connecte à l'univers pour répondre à toutes vos questions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full flex">{children}</body>
    </html>
  );
}
