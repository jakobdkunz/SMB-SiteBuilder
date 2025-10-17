"use client";
import { useState } from "react";

type TabPane = { label: string; content: React.ReactNode };
type Props = { title?: string; tabs: TabPane[] };

export default function Tabs({ title, tabs }: Props) {
  const [active, setActive] = useState(0);
  return (
    <section className="px-6 py-16 mx-auto max-w-6xl">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="border-b border-neutral-200">
        <div className="flex gap-4">
          {tabs.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`py-2 px-3 text-sm border-b-2 -mb-px ${
                active === idx ? "border-black text-black" : "border-transparent text-neutral-600 hover:text-black"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {tabs[active]?.content}
      </div>
    </section>
  );
}


