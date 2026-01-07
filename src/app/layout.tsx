import type { Metadata } from 'next';
import { Inter, Shippori_Mincho_B1 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeVerificationModal from '@/components/AgeVerificationModal';

const inter = Inter({ subsets: ['latin'] });
const shipporiMincho = Shippori_Mincho_B1({
  weight: ['600', '800'],
  subsets: ['latin'],
  variable: '--font-shippori-mincho',
});

export const metadata: Metadata = {
  title: '世の中に同人誌を広めたい',
  description: 'おすすめの同人誌をレビューして紹介するサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={shipporiMincho.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <AgeVerificationModal />
          <ThemeToggle />
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
