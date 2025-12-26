import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header>
        <h1>ゲームラボ</h1>
      </header>

      <main>
        <div className="container">
          <section className="game-list">
            <h2>- GAME LIST -</h2>
            <div className="card-container">
              <Link href="/games/game1" className="game-card">
                <div className="screenshot-placeholder"></div>
                <h3>ドットイーターアドベンチャー</h3>
                <p>迷路を駆け巡り、すべてのドットを食べ尽くせ！懐かしのアーケードスタイルゲーム。</p>
              </Link>
              <Link href="/games/game2" className="game-card">
                <div className="screenshot-placeholder"></div>
                <h3>スターシップ・コマンダー</h3>
                <p>宇宙艦隊を率いて銀河の平和を守れ。戦略シミュレーションの新たな金字塔。</p>
              </Link>
              <Link href="/games/game3" className="game-card">
                <div className="screenshot-placeholder"></div>
                <h3>魔城の秘宝</h3>
                <p>伝説の剣を手に、悪の竜が潜む城へ。クラシックなアクションRPG。</p>
              </Link>
              <Link href="/games/game4" className="game-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/games/game4.png" alt="マインスイーパーゲームのスクリーンショット" className="screenshot-placeholder" />
                <h3>マインスイーパー</h3>
                <p>爆弾を避けながら全てのパネルを開こう。定番のパズルゲーム。</p>
              </Link>
              <Link href="/games/janken" className="game-card">
                <div className="screenshot-placeholder"></div>
                <h3>じゃんけんゲーム</h3>
                <p>コンピューターとじゃんけん勝負！</p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 ゲームラボ</p>
      </footer>
    </>
  );
}