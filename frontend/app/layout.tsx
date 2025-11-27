import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Health Vault - Secure Healthcare Data Management',
  description: 'Access and manage your medical records securely. A two-sided platform for patients and healthcare providers.',
  keywords: 'healthcare, medical records, patient portal, electronic health records, EHR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}