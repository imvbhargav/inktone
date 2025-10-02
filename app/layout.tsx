import type { Metadata } from "next";
import {
  Anek_Bangla,
  Anek_Kannada,
  Anek_Latin,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const anekLatin = Anek_Latin({
  variable: "--font-anek-latin",
  subsets: ["latin"],
});

const anekKannada = Anek_Kannada({
  variable: "--font-anek-kannada",
  subsets: ["kannada"],
});

const anekBengali = Anek_Bangla({
  variable: "--font-anek-bengali",
  subsets: ["bengali"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inktone",
  description: "Easy CMS for Astro JamStack sites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anekLatin.variable} ${anekKannada.variable} ${anekBengali.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <section className="flex gap-1 h-screen overflow-hidden py-1 pl-1 md:pl-0 bg-black/10 font-sans print:h-auto print:overflow-visible print:block">
            <Sidebar />
            <div className="w-full bg-card flex-1 rounded-l-md border border-r-0 border-card-foreground/10 print:h-auto print:border-0 print:rounded-none">
              {children}
            </div>
          </section>
        </ThemeProvider>
      </body>
    </html>
  );
}
