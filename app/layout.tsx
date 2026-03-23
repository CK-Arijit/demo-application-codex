import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import LogoutButton from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Salesforce Account Portal",
  description: "UI shell for sign-in and dashboard account management",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ClerkProvider>
          <header className="border-b border-(--color-border) bg-(--color-surface)">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <Link
                href="/sign-in"
                className="text-sm font-semibold tracking-[0.16em] text-(--color-primary) uppercase"
              >
                Demo Company
              </Link>
              <LogoutButton />
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
