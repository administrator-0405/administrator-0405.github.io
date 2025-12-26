'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      <header>
        <h1><Link href="/">ゲームラボ</Link></h1>
      </header>
      <main>
        <h2>じゃんけんゲーム</h2>
        <div id="janken-container">
            <div id="player-hand">
                <p>あなたの手を選んでください：</p>
                <button id="rock" onClick={() => playJanken('グー')}>グー</button>
                <button id="scissors" onClick={() => playJanken('チョキ')}>チョキ</button>
                <button id="paper" onClick={() => playJanken('パー')}>パー</button>
            </div>
            <div id="result">
                <p>コンピューターの手： <span id="computer-hand">{computerHand}</span></p>
                <p>結果： <span id="outcome">{outcome}</span></p>
            </div>
        </div>
      </main>
    </>
  );
}
