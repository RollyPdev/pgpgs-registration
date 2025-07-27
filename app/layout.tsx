import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PGPGS Registration - 50th Golden Anniversary",
  description: "Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration. Join us in commemorating five decades of excellence and brotherhood.",
  keywords: "PGPGS, Pi Gamma Phi Gamma Sigma, 50th Anniversary, Registration, Roxas City, Capiz",
  metadataBase: new URL('https://pgpgs.rollyparedes.net'),
  openGraph: {
    title: "PGPGS Registration - 50th Golden Anniversary",
    description: "Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration. Join us in commemorating five decades of excellence and brotherhood.",
    url: 'https://pgpgs.rollyparedes.net',
    siteName: 'PGPGS Registration',
    images: [
      {
        url: '/PGPGS Logo.png',
        width: 800,
        height: 600,
        alt: 'PGPGS Logo - Pi Gamma Phi Gamma Sigma',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PGPGS Registration - 50th Golden Anniversary",
    description: "Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration.",
    images: ['/PGPGS Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'av8dabb1ffQj9a-3z2ODoTcThcnDH9PJlhF_PpQZUaM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://pgpgs.rollyparedes.net" />
        <meta name="author" content="PGPGS Organization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/PGPGS Logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
