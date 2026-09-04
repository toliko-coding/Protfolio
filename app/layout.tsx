import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { StatusWidget } from "@/components/layout/StatusWidget";
import { ExplorerBootGate } from "@/components/layout/ExplorerBootGate";
import { Terminal } from "@/components/terminal/Terminal";
import { AutoTerminal } from "@/components/terminal/AutoTerminal";
import { SystemFetch } from "@/components/explorer/SystemFetch";
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
          terminal={
            // pb-9 reserves room for the SystemFetch footer (fixed, full
            // width) below — same reasoning as Explorer's own gutter: it
            // shrinks this column's actual height so AutoTerminal's bottom
            // edge never ends up hidden behind that footer.
            <div className="flex h-full min-h-0 flex-col pb-9">
              <div className="min-h-0 flex-[2]">
                <Terminal />
              </div>
              <div className="min-h-0 flex-1 border-t border-foreground/10">
                <AutoTerminal />
              </div>
            </div>
          }
          explorer={
            <main className="contents">
              <ExplorerBootGate>{children}</ExplorerBootGate>
            </main>
          }
        />
        <StatusWidget />
        <SystemFetch />
      </body>
    </html>
  );
}
