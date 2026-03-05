import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Usando a fonte Inter, compatível com Next.js 14.1
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dono da Oficina",
  description: "Sistema de Gestão Automotiva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
