import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "TaxNG Academy – Bridging the Tax Knowledge Gap",
    template: "%s | TaxNG Academy",
  },
  description:
    "Learn Nigerian taxation from certified experts. TaxNG Academy offers courses on personal income tax, corporate tax, VAT, compliance, and more — designed for Nigerians.",
  keywords: ["Nigerian tax", "FIRS", "PAYE", "VAT Nigeria", "corporate tax", "tax compliance", "online tax courses", "e-learning Nigeria", "CITA", "PITA"],
  authors: [{ name: "TaxNG Academy" }],
  icons: {
    icon: [
      { url: "/favicon-icon.png", type: "image/png" },
    ],
    apple: "/favicon-icon.png",
    shortcut: "/favicon-icon.png",
  },
  openGraph: {
    title: "TaxNG Academy – Bridging the Tax Knowledge Gap",
    description: "Nigeria's #1 tax learning platform. Expert-led courses on PIT, CIT, VAT and compliance.",
    type: "website",
    images: [{ url: "/logo-taxng.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
