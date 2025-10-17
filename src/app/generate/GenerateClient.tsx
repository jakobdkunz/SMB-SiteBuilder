"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateClient() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary }),
    });
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
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold">Generate a new site</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <textarea className="w-full border rounded p-3" rows={6} placeholder="Describe the business..." value={summary} onChange={e=>setSummary(e.target.value)} />
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}


