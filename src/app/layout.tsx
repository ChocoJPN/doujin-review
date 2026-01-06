import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeVerificationModal from '@/components/AgeVerificationModal';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="ja">
      <body className={inter.className}>
        <AgeVerificationModal />
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
