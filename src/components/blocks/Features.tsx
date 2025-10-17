type FeatureItem = {
  title?: string;
  description?: string;
  icon?: string; // emoji or icon name (optional)
};

type Props = {
  title?: string;
  items?: FeatureItem[];
};

export default function Features({ title, items = [] }: Props) {
  return (
    <section className="px-6 py-16 mx-auto max-w-6xl">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-lg border border-neutral-200/10 bg-neutral-950/20 p-5">
            <div className="text-3xl mb-2">{it.icon || "⭐"}</div>
            <div className="font-medium">{it.title}</div>
            {it.description && <p className="text-neutral-500 text-sm mt-1">{it.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}


