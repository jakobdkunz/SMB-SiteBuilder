import { Block } from "@/lib/siteSchema";
import Hero from "@/components/blocks/Hero";
import Contact from "@/components/blocks/Contact";
import Features from "@/components/blocks/Features";
import Services from "@/components/blocks/Services";
import Testimonials from "@/components/blocks/Testimonials";
import Footer from "@/components/blocks/Footer";

export default function SiteRenderer({ blocks }: { blocks?: Block[] | null }) {
  const safeBlocks: Block[] = Array.isArray(blocks) ? blocks : [];
  return (
    <div>
      {safeBlocks.map((b) => {
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
          case "features":
            return (
              <Features
                key={b.id}
                title={(b.props as { title?: string }).title}
                items={(b.props as { items?: { title?: string; description?: string; icon?: string }[] }).items}
              />
            );
          case "services":
            return (
              <Services
                key={b.id}
                title={(b.props as { title?: string }).title}
                items={(b.props as { items?: { name?: string; description?: string; price?: string }[] }).items}
              />
            );
          case "testimonials":
            return (
              <Testimonials
                key={b.id}
                title={(b.props as { title?: string }).title}
                items={(b.props as { items?: { quote?: string; author?: string }[] }).items}
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
          case "footer":
            return (
              <Footer
                key={b.id}
                copyright={(b.props as { copyright?: string }).copyright}
                links={(b.props as { links?: { label: string; href: string }[] }).links}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}


