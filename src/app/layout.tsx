import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "GenGuessr — Where in the World is this From?",
  description:
    "A multiplayer geography guessing game powered by GenLayer Intelligent Contracts and Optimistic Democracy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 grid-bg antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
