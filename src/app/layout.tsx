import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-20 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed lg:text-lg left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:px-5 lg:py-2 lg:dark:bg-zinc-800/30">
              From the blog
            </p>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end pb-2 lg:pb-0 justify-center bg-gradient-to-t from-[#ff4d4d] via-[#f9cb28] dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <Link href="/">
                <Image
                  src="/next.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
                />
              </Link>
            </div>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
