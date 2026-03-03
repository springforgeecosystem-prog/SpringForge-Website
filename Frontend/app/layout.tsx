import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpringForge — Intelligent Spring Boot CI/CD Plugin',
  description:
    'SpringForge is an IntelliJ IDEA plugin that automates Spring Boot CI/CD with AI-powered Dockerfile, Kubernetes manifests, and pipeline generation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-dark-base text-content-primary min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
