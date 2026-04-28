import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VocalFlow | AI Text to Speech Platform",
  description: "Generate lifelike AI voiceovers in seconds with VocalFlow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
