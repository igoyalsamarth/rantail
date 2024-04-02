import type { Metadata } from "next";
import { Vollkorn } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const voll = Vollkorn({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rantail - TailwindCSS Obscucator",
  description: "The ultimate companion for Tailwind CSS. Write clean and secure code effortlessly. Protect your work from theft with Rantail. Encode your Tailwind classes with unique and customizable cuid's. Enjoy smooth, encoded, and theft-proof coding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-black ${voll.className}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
