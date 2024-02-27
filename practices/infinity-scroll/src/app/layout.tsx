import type { Metadata } from "next";
import { Gothic_A1 } from "next/font/google";
import "./globals.css";

const inter = Gothic_A1({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "무한스크롤, 무한성장",
  description: "같이, 가치",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="mx-auto max-w-md">{children}</div>
      </body>
    </html>
  );
}
