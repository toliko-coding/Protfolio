import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { Terminal } from "@/components/terminal/Terminal";
import { siteProfile } from "@/content/profile";
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
  title: {
    default: `${siteProfile.name} — ${siteProfile.tagline}`,
    template: `%s — ${siteProfile.name}`,
  },
  description: siteProfile.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden">
        <Header />
        <WorkspaceShell
          terminal={<Terminal />}
          explorer={<main className="contents">{children}</main>}
        />
      </body>
    </html>
  );
}
