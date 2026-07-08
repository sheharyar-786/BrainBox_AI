import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerOS AI - Your AI-Powered Learning & Career Companion",
  description: "Accelerate your learning, build production-ready projects, prepare for mock interviews, and optimize your resume with personalized AI mentorship.",
  keywords: ["career os", "learning library", "mock interview", "resume parser", "career roadmap", "knowledge graph"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark-base text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
