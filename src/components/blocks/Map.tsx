type Props = {
  address?: string;
  embedUrl?: string;
  height?: number;
};

export default function Map({ address, embedUrl, height = 360 }: Props) {
  const url = embedUrl || (address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : "");
  return (
    <section className="px-6 py-16 mx-auto max-w-6xl">
      <div className="rounded-lg overflow-hidden border border-neutral-200 bg-white shadow-sm">
        {url ? (
          <iframe src={url} width="100%" height={height} loading="lazy" style={{ border: 0 }} />
        ) : (
          <div className="p-6 text-neutral-600 text-sm">Map unavailable. Provide an address or embedUrl.</div>
        )}
      </div>
    </section>
  );
}


