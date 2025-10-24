import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import SessionProvider from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Manager - จัดการงานของคุณ",
  description: "แอปพลิเคชันจัดการงานที่ใช้งานง่าย มีประสิทธิภาพ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}