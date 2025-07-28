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
    url: 'https://pgpgs.rollyparedes.net/',
    siteName: 'PGPGS Registration',
    images: [
      {
        url: 'https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v5/pgpgs.rollyparedes.net/PGPGS%20Registration%20-%2050th%20Golden%20Anniversary/https%3A%2F%2Fpgpgs.rollyparedes.net%2FPGPGS%20Logo.png/rgba(224%2C%20196%2C%2094%2C%201)/og.png',
        width: 1200,
        height: 630,
        alt: 'PGPGS Registration - 50th Golden Anniversary',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PGPGS Registration - 50th Golden Anniversary",
    description: "Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration. Join us in commemorating five decades of excellence and brotherhood.",
    images: ['https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v5/pgpgs.rollyparedes.net/PGPGS%20Registration%20-%2050th%20Golden%20Anniversary/https%3A%2F%2Fpgpgs.rollyparedes.net%2FPGPGS%20Logo.png/rgba(224%2C%20196%2C%2094%2C%201)/og.png'],
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

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="OjsTwVz62W214j5UDVtZ-8BBY2JzVv1xgGxTgxyG1mw" />
        <meta property="og:url" content="https://pgpgs.rollyparedes.net/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PGPGS Registration - 50th Golden Anniversary" />
        <meta property="og:description" content="Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration. Join us in commemorating five decades of excellence and brotherhood." />
        <meta property="og:image" content="https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v5/pgpgs.rollyparedes.net/PGPGS%20Registration%20-%2050th%20Golden%20Anniversary/https%3A%2F%2Fpgpgs.rollyparedes.net%2FPGPGS%20Logo.png/rgba(224%2C%20196%2C%2094%2C%201)/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="pgpgs.rollyparedes.net" />
        <meta property="twitter:url" content="https://pgpgs.rollyparedes.net/" />
        <meta name="twitter:title" content="PGPGS Registration - 50th Golden Anniversary" />
        <meta name="twitter:description" content="Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration. Join us in commemorating five decades of excellence and brotherhood." />
        <meta name="twitter:image" content="https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v5/pgpgs.rollyparedes.net/PGPGS%20Registration%20-%2050th%20Golden%20Anniversary/https%3A%2F%2Fpgpgs.rollyparedes.net%2FPGPGS%20Logo.png/rgba(224%2C%20196%2C%2094%2C%201)/og.png" />
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KDX7VL5R');`
        }} />
        <link rel="canonical" href="https://pgpgs.rollyparedes.net" />
        <meta name="author" content="PGPGS Organization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/PGPGS Logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDX7VL5R"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
