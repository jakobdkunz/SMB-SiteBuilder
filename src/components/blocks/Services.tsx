type ServiceItem = {
  name?: string;
  description?: string;
  price?: string;
};

type Props = {
  title?: string;
  items?: ServiceItem[];
};

export default function Services({ title, items = [] }: Props) {
  return (
    <section className="px-6 py-16 mx-auto max-w-6xl">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-200/10 overflow-hidden">
        {items.map((s, idx) => (
          <div key={idx} className="p-5 flex items-start justify-between gap-6 bg-neutral-950/20">
            <div>
              <div className="font-medium">{s.name}</div>
              {s.description && <p className="text-neutral-500 text-sm mt-1">{s.description}</p>}
            </div>
            {s.price && <div className="text-sm whitespace-nowrap">{s.price}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}


