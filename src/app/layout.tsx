import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ohio Hospitals Atlas",
  description: "Interactive map of all 210 hospitals across Ohio. Search, filter, and explore healthcare facilities by region, city, or county.",
  keywords: ["Ohio", "hospitals", "healthcare", "map", "medical centers"],
  authors: [{ name: "Max Ghenis" }],
  openGraph: {
    title: "Ohio Hospitals Atlas",
    description: "Find healthcare near you - 210 hospitals across Ohio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
