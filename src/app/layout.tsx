import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalNav, Footer } from "@/components/common";
import { DrawerAnimationWrapper } from "@/components/features/Blog/PostDrawer/DrawerAnimationWrapper";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "highlight.js/styles/github-dark-dimmed.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: {
        default: "AI Dev Playbook",
        template: "%s | AI Dev Playbook"
    },
    description:
        "AI 에이전트와 함께하는 개발 경험을 기록합니다. Claude Code, Cursor 등 AI 도구 설정, 문제 해결, 워크플로우 개선 팁.",
    keywords: ["AI 에이전트", "Claude Code", "Cursor", "프롬프트 엔지니어링", "개발 도구"],
    authors: [{ name: "AI Dev Playbook" }],
    openGraph: {
        type: "website",
        locale: "ko_KR",
        siteName: "AI Dev Playbook"
    }
};

export default function RootLayout({
    children,
    drawer
}: Readonly<{
    children: React.ReactNode;
    drawer: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider>
                    <div className="flex h-screen overflow-hidden">
                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                            <GlobalNav />
                            <div className="flex-1 overflow-y-auto">
                                <main className="flex-1">{children}</main>
                                <Footer />
                            </div>
                        </div>
                        <DrawerAnimationWrapper>{drawer}</DrawerAnimationWrapper>
                    </div>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
