type Props = {
  brand?: string;
  nav?: { label: string; href: string }[];
};

export default function Header({ brand = "Your Business", nav = [] }: Props) {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        <div className="font-semibold text-lg">{brand}</div>
        <nav className="hidden md:flex gap-6 text-sm text-neutral-700">
          {nav.map((n, idx) => (
            <a key={idx} href={n.href} className="hover:text-black">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}


