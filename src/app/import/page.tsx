"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    setLoading(false);
    alert("Import started (stub)");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold">Import existing site</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input className="w-full border rounded p-3" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "Submitting..." : "Start import"}
        </button>
      </form>
    </div>
  );
}


