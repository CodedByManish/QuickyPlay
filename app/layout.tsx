import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickyPlay",
  description: "QuickyPlay is a fast, responsive, and cross-device web app offering an exciting collection of online games.",
  keywords: ["QuickyPlay", "online games","Quick play", "Quick game", "instant play", "responsive games", "mobile games", "web gaming", "game hub"],
  authors: [{ name: "QuickyPlay Team" }],
  openGraph: {
    title: "QickyPlay - Play Online Games Anywhere",
    description: "Discover a diverse collection of online games on QickyPlay — built for speed and all screen sizes.",
    url: "https://quickyplay.com", 
    siteName: "QuickyPlay",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" type="image/png" href="/logo.png" />
    
        
      </head>
      <body>{children}</body>
    </html>
  );
}
