import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "바이브 초이스 - 밸런스 게임 커뮤니티",
    template: "%s | 바이브 초이스",
  },
  description: "두 가지 선택지로 게임을 만들고, 다른 사람들과 투표하며 소통하는 밸런스 게임 커뮤니티",
  keywords: ["밸런스 게임", "선택 게임", "투표", "커뮤니티", "바이브 초이스"],
  authors: [{ name: "바이브 초이스" }],
  creator: "바이브 초이스",
  publisher: "바이브 초이스",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vibechoice.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "바이브 초이스",
    title: "바이브 초이스 - 밸런스 게임 커뮤니티",
    description: "두 가지 선택지로 게임을 만들고, 다른 사람들과 투표하며 소통하는 밸런스 게임 커뮤니티",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "바이브 초이스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "바이브 초이스 - 밸런스 게임 커뮤니티",
    description: "두 가지 선택지로 게임을 만들고, 다른 사람들과 투표하며 소통하는 밸런스 게임 커뮤니티",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
