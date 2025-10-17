type Props = {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  image?: { src: string; alt?: string };
};

import Image from "next/image";

export default function Hero({ headline, subheadline, primaryCta, image }: Props) {
  return (
    <section className="px-6 py-20 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold">{headline || "Grow your local business."}</h1>
        {subheadline && <p className="mt-4 text-lg text-neutral-700">{subheadline}</p>}
        {primaryCta && (
          <a href={primaryCta.href} className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-md">
            {primaryCta.label}
          </a>
        )}
      </div>
      {image && (
        <Image src={image.src} alt={image.alt || ""} width={800} height={600} className="w-full h-auto rounded-lg shadow" />
      )}
    </section>
  );
}


