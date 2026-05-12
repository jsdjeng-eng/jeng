import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import { ThemeBootScript, ThemeProvider } from "@/providers/ThemeProvider";

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
  title: "Jeng - Build, ship, repeat",
  description:
    "Jeng is a modern Next.js starter with Better Auth, Firestore, and Resend wired up.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeBootScript />
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
      <p>Built with Next.js 16, Better Auth, Firestore, and Resend.</p>
    </footer>
  );
}
