import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { DaveDataProvider } from "@/lib/data/DaveDataProvider";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Dave Strong",
  description: "A private dashboard for durable dad strength, food, recovery, and progress."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DaveDataProvider>
            <AppShell>{children}</AppShell>
          </DaveDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
