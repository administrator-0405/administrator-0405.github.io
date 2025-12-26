import Link from 'next/link';

interface GameCardProps {
  href: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export default function GameCard({ href, title, description, imageSrc }: GameCardProps) {
  return (
    <Link 
      href={href} 
      className="block w-[280px] bg-[#222] border-4 border-white p-4 transition-transform duration-200 hover:-translate-y-1 hover:bg-[#0000AA]"
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={imageSrc} 
          alt={`${title} screenshot`} 
          className="w-full h-[180px] bg-[#555] border-b-4 border-white mb-4 object-cover block" 
        />
      ) : (
        <div className="w-full h-[180px] bg-[#555] border-b-4 border-white mb-4" />
      )}
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </Link>
  );
}
