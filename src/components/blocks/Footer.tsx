type Props = {
  copyright?: string;
  links?: { label: string; href: string }[];
};

export default function Footer({ copyright, links = [] }: Props) {
  return (
    <footer className="px-6 py-12 mt-10 border-t border-neutral-900">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-500">{copyright || "© Your Business"}</div>
        <nav className="flex gap-4 text-sm">
          {links.map((l, idx) => (
            <a key={idx} href={l.href} className="hover:underline">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}


