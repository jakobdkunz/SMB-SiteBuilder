"use client";
import DOMPurify from "isomorphic-dompurify";

type Props = {
  html?: string | null;
  css?: string | null;
  basePath?: string; // base href for internal links
};

export default function CodeRenderer({ html, css, basePath }: Props) {
  const raw = String(html || "");
  // Extract body content if a full document is provided
  const withoutDoctype = raw.replace(/<!doctype[^>]*>/i, "");
  const bodyMatch = withoutDoctype.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const fragment = bodyMatch ? bodyMatch[1] : withoutDoctype
    .replace(/<html[^>]*>/i, "")
    .replace(/<\/html>/i, "")
    .replace(/<head>[\s\S]*?<\/head>/i, "");

  // Rewrite internal links to stay within preview namespace
  const pref = (basePath || "").replace(/\/$/, "");
  const hrefRegex = /href=\"([^\"]+)\"/g;
  const withRewrittenLinks = pref
    ? fragment.replace(hrefRegex, (_m, url) => {
        const trimmed = String(url || "");
        if (!trimmed) return `href=\"${url}\"`;
        // Skip external, anchors, protocols, protocol-relative, mailto/tel, already prefixed
        const isExternal = /^(https?:\/\/|\/{2}|mailto:|tel:|#)/i.test(trimmed);
        if (isExternal) return `href=\"${url}\"`;
        if (trimmed.startsWith(pref + "/") || trimmed === pref) return `href=\"${url}\"`;
        if (trimmed.startsWith("/")) return `href=\"${pref}${trimmed}\"`;
        const normalized = trimmed.replace(/^\.\//, "").replace(/^\.\./, "");
        return `href=\"${pref}/${normalized}\"`;
      })
    : fragment;

  const safeHtml = DOMPurify.sanitize(withRewrittenLinks, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["style"],
  });
  const safeCss = DOMPurify.sanitize(String(css || ""));
  return (
    <div>
      {safeCss ? <style dangerouslySetInnerHTML={{ __html: safeCss }} /> : null}
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </div>
  );
}


