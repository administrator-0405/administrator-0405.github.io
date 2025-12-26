import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <section className="text-center">
            <h2 className="text-2xl mb-10 text-center">- GAME LIST -</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <GameCard 
                href="/games/game1"
                title="ドットイーターアドベンチャー"
                description="迷路を駆け巡り、すべてのドットを食べ尽くせ！懐かしのアーケードスタイルゲーム。"
              />
              <GameCard 
                href="/games/game2"
                title="スターシップ・コマンダー"
                description="宇宙艦隊を率いて銀河の平和を守れ。戦略シミュレーションの新たな金字塔。"
              />
              <GameCard 
                href="/games/game3"
                title="魔城の秘宝"
                description="伝説の剣を手に、悪の竜が潜む城へ。クラシックなアクションRPG。"
              />
              <GameCard 
                href="/games/game4"
                title="マインスイーパー"
                description="爆弾を避けながら全てのパネルを開こう。定番のパズルゲーム。"
                imageSrc="/games/game4.png"
              />
              <GameCard 
                href="/games/janken"
                title="じゃんけんゲーム"
                description="コンピューターとじゃんけん勝負！"
              />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
