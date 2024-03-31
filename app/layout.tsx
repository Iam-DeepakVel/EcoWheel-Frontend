import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserInfoProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoWheel",
  description: "EcoWheel: Driving Towards a Greener Future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserInfoProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </UserInfoProvider>
  );
}
