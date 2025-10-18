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
  const withRewrittenLinks = pref
    ? fragment
        // root-relative: href="/contact" -> href="{pref}/contact"
        .replace(/href=\"\/(?!\/)([^\"#]+)\"/g, (_m, p1) => `href=\"${pref}/${p1}\"`)
        // relative without protocol: href="about" or "./about" or "../about"
        .replace(/href=\"(?![a-zA-Z]+:|\/\/|#)([^\"]+)\"/g, (_m, p1) => `href=\"${pref}/${p1.replace(/^\.\//, "")}\"`)
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


