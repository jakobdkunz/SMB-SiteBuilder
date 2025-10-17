import { Block } from "@/lib/siteSchema";
import Hero from "@/components/blocks/Hero";
import Contact from "@/components/blocks/Contact";

export default function SiteRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((b) => {
        switch (b.type) {
          case "hero":
            return <Hero key={b.id} {...(b.props as any)} />;
          case "contact":
            return <Contact key={b.id} {...(b.props as any)} />;
          default:
            return null;
        }
      })}
    </div>
  );
}


