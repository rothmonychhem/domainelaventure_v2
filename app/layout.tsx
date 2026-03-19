import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domaine Aventure",
  description:
    "Cozy chalet getaways with warm interiors, forest views, and a simple reservation experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
