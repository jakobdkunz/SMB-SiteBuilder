type Testimonial = {
  quote?: string;
  author?: string;
};

type Props = {
  title?: string;
  items?: Testimonial[];
};

export default function Testimonials({ title, items = [] }: Props) {
  return (
    <section className="px-6 py-16 mx-auto max-w-6xl">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((t, idx) => (
          <blockquote key={idx} className="rounded-lg border border-neutral-200/10 bg-neutral-950/20 p-5">
            <p className="italic">“{t.quote}”</p>
            {t.author && <footer className="mt-3 text-sm text-neutral-500">— {t.author}</footer>}
          </blockquote>
        ))}
      </div>
    </section>
  );
}


