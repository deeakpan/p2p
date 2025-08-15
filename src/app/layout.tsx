import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peer2Pepu - Decentralized Prediction Markets",
  description: "Bet on What's Next. Peer-to-Peer. No Middleman. Stake on real-world events and earn from your predictions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC (Flash of Unstyled Content)
              try {
                const theme = localStorage.getItem('peer2pepu-theme') || 'dark';
                const isDark = theme === 'dark';
                const root = document.documentElement;
                const body = document.body;
                
                if (isDark) {
                  root.classList.add('dark');
                  root.classList.remove('light');
                  body.classList.add('dark');
                  body.classList.remove('light');
                } else {
                  root.classList.add('light');
                  root.classList.remove('dark');
                  body.classList.add('light');
                  body.classList.remove('dark');
                }
              } catch (e) {
                // Fallback to dark mode
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}