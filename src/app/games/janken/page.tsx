'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PixelButton from '@/components/PixelButton';
import BackToTop from '@/components/BackToTop';

export default function Janken() {
  const [computerHand, setComputerHand] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null);

  const hands = ['グー', 'チョキ', 'パー'];

  const playJanken = (selectedHand: string) => {
    const cpuHand = hands[Math.floor(Math.random() * 3)];
    setComputerHand(cpuHand);

    if (selectedHand === cpuHand) {
      setOutcome('あいこ');
    } else if (
      (selectedHand === 'グー' && cpuHand === 'チョキ') ||
      (selectedHand === 'チョキ' && cpuHand === 'パー') ||
      (selectedHand === 'パー' && cpuHand === 'グー')
    ) {
      setOutcome('あなたの勝ち');
    } else {
      setOutcome('あなたの負け');
    }
  };

  return (
    <>
      <Header />
      <main>
        <h2 className="text-3xl text-center mb-10">じゃんけんゲーム</h2>
        <div className="text-center mt-12">
            <div className="mb-8">
                <p className="mb-4">あなたの手を選んでください：</p>
                <PixelButton onClick={() => playJanken('グー')}>グー</PixelButton>
                <PixelButton onClick={() => playJanken('チョキ')}>チョキ</PixelButton>
                <PixelButton onClick={() => playJanken('パー')}>パー</PixelButton>
            </div>
            <div className="mt-8 text-2xl">
                <p>コンピューターの手： <span className="font-bold">{computerHand}</span></p>
                <p>結果： <span className="font-bold text-red-500">{outcome}</span></p>
            </div>
        </div>
        <BackToTop />
      </main>
      <Footer />
    </>
  );
}