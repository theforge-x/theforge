import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "theForge",
  authors: [{ name: "theForge" }],
  creator: "theForge",
  publisher: "theForge",
  keywords: [
    "growth systems",
    "growth strategy",
    "digital product studio",
    "AI automation",
    "revenue operations",
    "conversion optimization",
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
    siteName: "theForge",
    title: "theForge · Growth Systems Studio",
    description:
      "Diagnose the constraint stalling your growth, build the system to fix it, and create an engine that compounds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "theForge · Growth Systems Studio",
    description:
      "Diagnose the constraint stalling your growth, build the system to fix it, and create an engine that compounds.",
  },
  icons: { icon: "/logo_sq_anv.svg" },
  title: {
    default: "theForge · Growth Systems Studio",
    template: "%s · theForge",
  },
  description:
    "theForge is a growth systems studio. We diagnose the constraint stalling your growth, build the acquisition, offer, and retention systems to fix it, then run the retainer that compounds it.",
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
      className="h-full"
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
      </body>
    </html>
  );
}
