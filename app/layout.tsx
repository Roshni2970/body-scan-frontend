import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Body Scanner",
  description: "AI 3D Body Mesh Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
