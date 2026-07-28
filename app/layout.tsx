import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dm = DM_Mono({
  variable: "--font-dm",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const bric = Bricolage_Grotesque({
  variable: "--font-bric",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "theForge",
  authors: [{ name: "theForge Revenue Systems" }],
  creator: "theForge Revenue Systems",
  publisher: "theForge Revenue Systems",
  keywords: [
    "revenue systems studio",
    "growth systems consulting",
    "CRM implementation and automation",
    "website to CRM conversion systems",
    "referral to pipeline systems",
    "lead follow-up automation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "theForge Revenue Systems",
    title: "theForge Revenue Systems · Revenue Systems Studio",
    description:
      "Revenue systems for founder-led service firms that have outgrown referrals and disconnected marketing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "theForge Revenue Systems · Revenue Systems Studio",
    description:
      "Revenue systems for founder-led service firms that have outgrown referrals and disconnected marketing.",
  },
  icons: { icon: "/logo.svg" },
  title: {
    default: "theForge Revenue Systems · Revenue Systems Studio",
    template: "%s · theForge",
  },
  description:
    "theForge is a HubX company that builds revenue systems for founder-led service firms that have outgrown referrals. We connect positioning, website, CRM, automation and follow-up into one measurable growth engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${dm.variable} ${bric.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
