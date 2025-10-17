"use client";
import DOMPurify from "isomorphic-dompurify";

type Props = {
  html?: string | null;
  css?: string | null;
};

export default function CodeRenderer({ html, css }: Props) {
  const raw = String(html || "");
  // Extract body content if a full document is provided
  const withoutDoctype = raw.replace(/<!doctype[^>]*>/i, "");
  const bodyMatch = withoutDoctype.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const fragment = bodyMatch ? bodyMatch[1] : withoutDoctype
    .replace(/<html[^>]*>/i, "")
    .replace(/<\/html>/i, "")
    .replace(/<head>[\s\S]*?<\/head>/i, "");

  const safeHtml = DOMPurify.sanitize(fragment, {
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


