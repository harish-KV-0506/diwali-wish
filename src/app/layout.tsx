import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cinzel, Tangerine } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Shubh Deepavali — Light Up the Festival of Lights",
  description: "An interactive 3D Diwali experience. Discover the story of Diwali, generate personalized wish links, light virtual diyas, craft rangoli, and launch fireworks. Spread the light.",
  keywords: ["Diwali", "Deepavali", "festival of lights", "Diwali wishes", "Diwali story", "Ramayana", "interactive Diwali", "virtual diwali", "3D diwali"],
  authors: [{ name: "Shubh Deepavali" }],
  icons: {
    icon: "🪔",
  },
  openGraph: {
    title: "Shubh Deepavali — Light Up the Festival of Lights",
    description: "Interactive 3D Diwali experience with personalized wishes, story, fireworks & rangoli.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Shubh Deepavali",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubh Deepavali — Festival of Lights",
    description: "Interactive 3D Diwali experience with personalized wishes, story, fireworks & rangoli.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${tangerine.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
