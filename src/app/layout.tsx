import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PwaModal from "@/components/pwa/PwaModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dono da Oficina",
  description: "Sistema de Gestão Automotiva Multi-tenant",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <PwaModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
