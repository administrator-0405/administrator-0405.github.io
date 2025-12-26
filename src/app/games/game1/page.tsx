import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function Page() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="flex flex-col justify-center items-center h-[60vh] text-center">
            <h1 className="text-5xl mb-4">- 工事中 -</h1>
            <p className="mb-8">このページは現在作成中です。</p>
            <BackToTop />
        </div>
      </div>
      <Footer />
    </>
  );
}