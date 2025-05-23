import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ClientOnly from '@/components/ClientOnly';
import Header from '@/components/ui/Header/Header';
import Footer from '@/components/footer/Footer';
import "@/components/styles/globals.css";
import "@/components/styles/colors.css";
import "@/app/page.module.css";
import { Suspense } from 'react';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lia-Portal",
  description: "The best place to find interns",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <Suspense fallback={null}> */}
            <ClientOnly>
              <Header />
              {children}
              <Footer />
            </ClientOnly>
          {/* </Suspense>  */}
        </AuthProvider>
      </body>
    </html>
  );
}