import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthGuard } from "@/components/auth-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Church Library Management",
  description: "Book management system for church libraries",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthGuard>
            <div className="min-h-screen bg-background">
              <Sidebar />
              <div className="lg:pl-64">
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  )
}
