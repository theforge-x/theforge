import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

//Funnel_Sans,Geist

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

export const metadata: Metadata = {
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
      </body>
    </html>
  );
}
