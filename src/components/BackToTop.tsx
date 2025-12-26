import Link from 'next/link';

export default function BackToTop() {
  return (
    <div className="text-center mt-10">
      <Link 
        href="/" 
        className="inline-block px-6 py-4 border-4 border-white hover:bg-[#0000AA] transition-colors duration-200"
      >
        &lt; TOP PAGE
      </Link>
    </div>
  );
}
