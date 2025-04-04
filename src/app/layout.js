import { Inter } from 'next/font/google';
import "@/components/styles/globals.css";
import "@/components/styles/colors.css";
import Header from '@/components/ui/Header/Header'
import Footer from '@/components/footer/Footer'
import "@/app/page.module.css";

import ClientOnly from '@/components/ClientOnly';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ClientOnly>
          <Header />
        </ClientOnly>
        {children}
        <Footer />
      </body>
    </html>
  );
}