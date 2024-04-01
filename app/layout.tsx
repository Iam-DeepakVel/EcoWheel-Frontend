import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserInfoProvider } from "@/context/UserContext";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

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
        <body className={inter.className}>
          <Toaster position="top-center" />
          <NextTopLoader color="#2983cc" height={3} />
          <main> {children}</main>
        </body>
      </html>
    </UserInfoProvider>
  );
}
