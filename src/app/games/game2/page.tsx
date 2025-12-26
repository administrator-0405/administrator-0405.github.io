import Link from 'next/link';

export default function Page() {
  return (
    <>
      <style>{`
        .construction {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80vh;
            text-align: center;
        }
        .construction h1 {
            font-size: 3em;
        }
        .back-link {
            margin-top: 40px;
            display: inline-block;
            padding: 15px 25px;
            border: 4px solid #fff;
        }
        .back-link:hover {
            background-color: #0000AA;
        }
      `}</style>
      <div className="container">
        <div className="construction">
            <h1>- 工事中 -</h1>
            <p>このページは現在作成中です。</p>
            <Link href="/" className="back-link">&lt; TOP PAGE</Link>
        </div>
      </div>
    </>
  );
}
