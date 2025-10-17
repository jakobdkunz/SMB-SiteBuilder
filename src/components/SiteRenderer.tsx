import { Block, type Site } from "@/lib/siteSchema";
import Hero from "@/components/blocks/Hero";
import Contact from "@/components/blocks/Contact";
import Features from "@/components/blocks/Features";
import Services from "@/components/blocks/Services";
import Testimonials from "@/components/blocks/Testimonials";
import Footer from "@/components/blocks/Footer";
import Header from "@/components/blocks/Header";
import Map from "@/components/blocks/Map";
import Tabs from "@/components/blocks/Tabs";
import CodeRenderer from "@/components/CodeRenderer";

export default function SiteRenderer({ site, blocks, currentPath }: { site?: Site | null; blocks?: Block[] | null; currentPath?: string }) {
  const path = `/${(currentPath || "/").replace(/^\/+/, "").replace(/\/$/, "")}`;
  const basePath = site ? `/preview/${site.siteId}` : undefined;

  // Multi-page: if specific page exists, render its code
  const page = site?.pages?.find((p) => `/${(p.path || "/").replace(/^\/+/, "")}` === path) || (path === "/" ? site?.pages?.find((p)=> p.path === "/" || p.path === "") : undefined);
  if (page?.code?.html) {
    return <CodeRenderer html={page.code.html} css={page.code.css} basePath={basePath} />;
  }

  // Single-code-site fallback
  const hasCode = Boolean(site?.code?.html);
  if (hasCode) {
    return <CodeRenderer html={site?.code?.html || ""} css={site?.code?.css || ""} basePath={basePath} />;
  }

  const safeBlocks: Block[] = Array.isArray(blocks ?? site?.blocks) ? (blocks ?? site?.blocks ?? []) : [];
  return (
    <div>
      {safeBlocks.map((b) => {
        switch (b.type) {
          case "header":
            return (
              <Header
                key={b.id}
                brand={(b.props as { brand?: string }).brand}
                nav={(b.props as { nav?: { label: string; href: string }[] }).nav}
              />
            );
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
          case "map":
            return (
              <Map
                key={b.id}
                address={(b.props as { address?: string }).address}
                embedUrl={(b.props as { embedUrl?: string }).embedUrl}
                height={(b.props as { height?: number }).height}
              />
            );
          case "tabs": {
            const tabs = (b.props as { title?: string; tabs?: { label: string; blocks: Block[] }[] });
            return (
              <Tabs
                key={b.id}
                title={tabs?.title}
                tabs={(tabs?.tabs || []).map((t) => ({
                  label: t.label,
                  content: <SiteRenderer blocks={t.blocks} />,
                }))}
              />
            );
          }
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


