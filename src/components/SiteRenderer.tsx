import { Block } from "@/lib/siteSchema";
import Hero from "@/components/blocks/Hero";
import Contact from "@/components/blocks/Contact";

export default function SiteRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((b) => {
        switch (b.type) {
          case "hero":
            return (
              <Hero
                key={b.id}
                headline={(b.props as { headline?: string }).headline}
                subheadline={(b.props as { subheadline?: string }).subheadline}
                primaryCta={(b.props as { primaryCta?: { label: string; href: string } }).primaryCta}
                image={(b.props as { image?: { src: string; alt?: string } }).image}
              />
            );
          case "contact":
            return (
              <Contact
                key={b.id}
                phone={(b.props as { phone?: string }).phone}
                address={(b.props as { address?: string }).address}
                email={(b.props as { email?: string }).email}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}


