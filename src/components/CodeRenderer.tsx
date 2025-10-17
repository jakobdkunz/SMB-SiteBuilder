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

  // If we have a basePath, inject a <base> to keep links inside preview
  const withBase = basePath
    ? fragment.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n<base href="${basePath.replace(/\/$/, "")}/" />`)
    : fragment;

  const safeHtml = DOMPurify.sanitize(withBase, {
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


