import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

/**
 * Root layout metadata for the Second Brain application
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: "Second Brain",
  description: "Your personal knowledge base and project manager",
  keywords: ["knowledge base", "notes", "documents", "project management", "kanban"],
};

/**
 * Root Layout Component
 * 
 * Provides the base HTML structure and consistent layout for all pages.
 * Includes the global header navigation component.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content
 * @returns {JSX.Element} The root layout structure
 * 
 * @example
 * // This layout wraps all pages automatically
 * // Children are rendered where {children} appears
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
