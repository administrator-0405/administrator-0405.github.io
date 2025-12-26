# ゲームラボ (Game Lab)

懐かしのアーケードスタイルゲームを集めたWebサイトです。
Next.jsで構築されており、GitHub Actionsを使用してGitHub Pagesに自動デプロイされる構成になっています。

## 🎮 収録ゲーム

*   **マインスイーパー**: 定番のパズルゲーム。爆弾を避けて全てのパネルを開けよう！
*   **じゃんけんゲーム**: コンピューターと勝負！
*   **ドットイーターアドベンチャー**: (工事中)
*   **スターシップ・コマンダー**: (工事中)
*   **魔城の秘宝**: (工事中)

## 🛠️ 技術スタック

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Fonts**: Google Fonts (DotGothic16, Press Start 2P)
*   **CI/CD**: GitHub Actions
*   **Hosting**: GitHub Pages

## 🚀 ローカルでの実行方法

1.  **依存関係のインストール**:
    ```bash
    npm install
    ```

2.  **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスすると、サイトが表示されます。

3.  **ビルド (静的エクスポート)**:
    ```bash
    npm run build
    ```
    `out/` ディレクトリに静的ファイルが出力されます。

## 📂 デプロイについて

`main` ブランチにプッシュすると、GitHub Actionsが自動的に起動し、`npm run build` を実行して生成された静的ファイルを `pages` ブランチにデプロイします。