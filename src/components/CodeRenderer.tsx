"use client";
import DOMPurify from "isomorphic-dompurify";

type Props = {
  html?: string | null;
  css?: string | null;
};

export default function CodeRenderer({ html, css }: Props) {
  const safeHtml = DOMPurify.sanitize(String(html || ""), {
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


