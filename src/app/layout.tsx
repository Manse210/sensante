import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SénSanté",
  description: "Assistant de santé communautaire avec IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
