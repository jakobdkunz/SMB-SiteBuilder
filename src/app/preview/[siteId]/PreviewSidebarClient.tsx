"use client";
import { useState } from "react";
import Link from "next/link";

export default function PreviewSidebarClient({ siteId }: { siteId: string }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data?.error || res.statusText);
      }
      const data = await res.json();
      setExplanation(data?.explanation || "");
      location.reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setExplanation(`Error: ${msg}`);
    } finally {
      setSubmitting(false);
      setMessage("");
    }
  };

  return (
    <aside className="border-r h-full overflow-auto p-6 space-y-4">
      <div className="text-sm text-neutral-500">Previewing site</div>
      <div className="text-lg font-semibold">Site editor</div>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea className="w-full border rounded p-2" rows={4} placeholder="Ask for a change (e.g., 'Make the hero headline bigger, add About page')" value={message} onChange={e=>setMessage(e.target.value)} />
        <button disabled={submitting || !message.trim()} className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50">
          {submitting ? "Applying..." : "Apply change"}
        </button>
      </form>
      {explanation && (
        <div className="text-xs text-neutral-700 whitespace-pre-wrap border rounded p-3 bg-neutral-50">{explanation}</div>
      )}
      <div className="text-xs text-neutral-500">
        <div className="font-semibold mb-1">Quick links</div>
        <ul className="space-y-1">
          <li><Link className="underline" href={`/preview/${siteId}`}>Home</Link></li>
          <li><Link className="underline" href={`/preview/${siteId}/about`}>About</Link></li>
          <li><Link className="underline" href={`/preview/${siteId}/services`}>Services</Link></li>
          <li><Link className="underline" href={`/preview/${siteId}/contact`}>Contact</Link></li>
        </ul>
      </div>
    </aside>
  );
}


