import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amagone",
  description: "Search outside the box",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
