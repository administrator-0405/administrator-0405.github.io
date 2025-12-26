interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PixelButton({ children, className = '', ...props }: PixelButtonProps) {
  return (
    <button 
      className={`
        text-2xl m-2 px-5 py-2 cursor-pointer 
        font-inherit bg-[#333] text-white border-2 border-white 
        hover:bg-[#555] active:translate-y-1 transition-all
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
