"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateClient() {
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string>("");
  const [menuItems, setMenuItems] = useState<string>("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [primary, setPrimary] = useState("");
  const [accent, setAccent] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLog(["Starting generation..."]);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        tagline,
        description,
        services: services.split(",").map(s=>s.trim()).filter(Boolean),
        menuItems: menuItems.split(",").map(s=>s.trim()).filter(Boolean),
        address,
        hours,
        colors: { primary, accent },
        extra,
      }),
    });
    if (!res.ok) {
      let message = res.statusText;
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        const text = await res.text();
        if (text) message = text;
      }
      setLog((l)=>[...l, "Error: "+(message || "Unknown error")]);
      alert("Generation failed: " + (message || "Unknown error"));
      setLoading(false);
      return;
    }
    const data = await res.json();
    try {
      if (data?.siteId) {
        // Persist last generated siteId in localStorage for recovery across auth
        localStorage.setItem("smb_last_site_id", data.siteId);
      }
    } catch {}
    setLoading(false);
    if (data?.siteId) router.push(`/preview/${data.siteId}`);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-[380px_1fr]">
      <div className="border-r h-full overflow-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">New website</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input className="w-full border rounded p-2" placeholder="Business name" value={businessName} onChange={e=>setBusinessName(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Tagline (optional)" value={tagline} onChange={e=>setTagline(e.target.value)} />
          <textarea className="w-full border rounded p-2" rows={3} placeholder="Describe the business" value={description} onChange={e=>setDescription(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Services (comma-separated)" value={services} onChange={e=>setServices(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Menu items (comma-separated)" value={menuItems} onChange={e=>setMenuItems(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Address or location" value={address} onChange={e=>setAddress(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Operating hours" value={hours} onChange={e=>setHours(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="w-full border rounded p-2" placeholder="Primary color (e.g., #ff3ea5)" value={primary} onChange={e=>setPrimary(e.target.value)} />
            <input className="w-full border rounded p-2" placeholder="Accent color (optional)" value={accent} onChange={e=>setAccent(e.target.value)} />
          </div>
          <textarea className="w-full border rounded p-2" rows={3} placeholder="Additional details & design requests" value={extra} onChange={e=>setExtra(e.target.value)} />
          <button disabled={loading} className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {loading && (
          <div className="border rounded p-3 bg-neutral-50">
            <div className="text-sm font-medium">Live log</div>
            <div className="mt-2 text-xs text-neutral-700 whitespace-pre-wrap">
              {log.join("\n") || "Contacting model..."}
            </div>
          </div>
        )}
      </div>
      <div className="relative h-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[60%] h-[60%] rounded-3xl animate-pulse" style={{ background: "radial-gradient(circle at 20% 30%, rgba(255,62,165,.25), transparent 40%), radial-gradient(circle at 80% 20%, rgba(0,229,255,.25), transparent 40%), radial-gradient(circle at 50% 80%, rgba(255,204,0,.25), transparent 40%)" }} />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-400">Fill the form and click Generate</div>
        )}
      </div>
    </div>
  );
}


