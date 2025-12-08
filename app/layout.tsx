import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const inter = Inter({ subsets: ["latin"] })

// ✅ FIX: Viewport séparé (Next.js 14+)
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#003057',
}

export const metadata: Metadata = {
    title: "Carte Étudiant HE2B ESI",
    description: "Carte étudiante numérique sécurisée",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Carte HE2B",
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/icons/icon-192x192.png" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="Carte HE2B" />
        </head>
        <body className={inter.className}>
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <ServiceWorkerRegistration />
                {children}
            </ThemeProvider>
        </AuthProvider>
        </body>
        </html>
    )
}