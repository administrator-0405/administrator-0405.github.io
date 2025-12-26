import Link from 'next/link';

export default function Header() {
  return (
    <header className="text-center py-10 border-b-4 border-white mb-10">
      <h1 className="text-5xl drop-shadow-[4px_4px_0px_#555555]">
        <Link href="/">ゲームラボ</Link>
      </h1>
    </header>
  );
}
