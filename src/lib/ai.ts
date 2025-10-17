import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

export type ProviderName = "openai" | "anthropic" | "gemini";

export function getModel() {
  const provider = (process.env.AI_PROVIDER || "openai") as ProviderName;
  const modelName = process.env.AI_MODEL || (
    provider === "openai" ? "gpt-4o-mini" : provider === "anthropic" ? "claude-3-5-sonnet-latest" : "gemini-1.5-flash"
  );
  if (provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
    return anthropic(modelName);
  }
  if (provider === "gemini") {
    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "" });
    return google(modelName);
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return openai(modelName);
}

function hasAIConfig(): boolean {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  if (provider === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === "gemini") return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  return Boolean(process.env.OPENAI_API_KEY);
}

// Note: provider selection is handled implicitly by getModel()/hasAIConfig

// Output schema for code-based site generation consumed by the app-level SiteSchema
const CodeSiteOutputSchema = z.object({
  siteId: z.string(),
  theme: z.object({
    primary: z.string(),
    accent: z.string().optional(),
    fontFamily: z.string().default("Inter"),
  }),
  seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
  code: z.object({ html: z.string(), css: z.string().optional() }),
  // Multi-page support
  pages: z
    .array(
      z.object({
        path: z.string(),
        title: z.string().optional(),
        code: z.object({ html: z.string(), css: z.string().optional() }),
      })
    )
    .default([]),
  // Keep for forward-compat; renderer will ignore when code is present
  blocks: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["header","hero","features","services","testimonials","contact","map","tabs","footer"]),
        variant: z.string().default("default"),
        props: z.record(z.string(), z.any()).default({}),
      })
    )
    .default([]),
});

function getBrightFunBaseTemplate() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{title}}</title>
  </head>
  <body class="sf-body">
    <header class="sf-header">
      <div class="sf-container">
        <div class="sf-brand">{{brand}}</div>
        <nav class="sf-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
    <section id="hero" class="sf-hero">
      <div class="sf-container">
        <h1>{{headline}}</h1>
        <p>{{subheadline}}</p>
        <a class="sf-button" href="#contact">{{cta_label}}</a>
      </div>
    </section>
    <section id="services" class="sf-section">
      <div class="sf-container">
        <h2>What we offer</h2>
        <ul class="sf-cards">
          {{#each services}}
            <li class="sf-card"><h3>{{name}}</h3><p>{{description}}</p><span>{{price}}</span></li>
          {{/each}}
        </ul>
      </div>
    </section>
    <section id="reviews" class="sf-section sf-alt">
      <div class="sf-container">
        <h2>Happy customers</h2>
        <ul class="sf-grid">
          {{#each testimonials}}
            <li class="sf-quote">“{{quote}}” — {{author}}</li>
          {{/each}}
        </ul>
      </div>
    </section>
    <section id="contact" class="sf-section">
      <div class="sf-container">
        <h2>Get in touch</h2>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Address:</strong> {{address}}</p>
      </div>
    </section>
    <footer class="sf-footer"><div class="sf-container">© {{year}} {{brand}}</div></footer>
  </body>
</html>`;

  const css = `:root { --primary: #ff3ea5; --accent: #00e5ff; --bg: #fff7ed; --ink: #0f172a }
* { box-sizing: border-box }
body.sf-body { margin: 0; font-family: Inter, system-ui, sans-serif; color: var(--ink); background: var(--bg); }
.sf-container { max-width: 1100px; margin: 0 auto; padding: 16px; }
.sf-header { position: sticky; top: 0; background: linear-gradient(90deg, var(--primary), var(--accent)); color: white; }
.sf-header .sf-brand { font-weight: 800; font-size: 20px }
.sf-header .sf-nav a { color: white; margin-left: 16px; text-decoration: none; font-weight: 600 }
.sf-hero { padding: 80px 0; background: radial-gradient(600px circle at 20% 20%, rgba(255,62,165,.15), transparent), radial-gradient(600px circle at 80% 30%, rgba(0,229,255,.15), transparent); }
.sf-hero h1 { font-size: 48px; margin: 0 0 12px }
.sf-hero p { font-size: 18px; opacity: .8; margin: 0 0 24px }
.sf-button { display: inline-block; background: var(--primary); color: white; padding: 12px 20px; border-radius: 999px; text-decoration: none; box-shadow: 0 10px 20px rgba(255,62,165,.25) }
.sf-section { padding: 56px 0 }
.sf-section.sf-alt { background: white }
.sf-cards { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px }
.sf-card { background: white; border: 2px solid #fde68a; border-radius: 16px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.04) }
.sf-grid { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px }
.sf-quote { background: linear-gradient(180deg, #fff, #fffbeb); border: 1px solid #ffe08a; border-radius: 12px; padding: 16px }
.sf-footer { background: #0f172a; color: white; padding: 24px 0; margin-top: 24px }
`;
  return { html, css };
}

// (fallback builder removed – errors are propagated)

export async function generateSiteSchemaFromSummary(summary: string, siteId: string) {
  if (!hasAIConfig()) {
    throw new Error(
      "AI not configured. Set AI_PROVIDER, AI_MODEL, and the corresponding API key."
    );
  }

  const model = getModel();
  const base = getBrightFunBaseTemplate();
  // Gemini is stricter about object properties; relax blocks.props typing for that provider
  const GeminiCodeSiteSchema = z.object({
    siteId: z.string(),
    theme: z.object({
      primary: z.string(),
      accent: z.string().optional(),
      fontFamily: z.string().default("Inter"),
    }),
    seo: z.object({ title: z.string(), description: z.string().optional() }).optional(),
    code: z.object({ html: z.string(), css: z.string().optional() }),
    pages: z
      .array(
        z.object({
          path: z.string(),
          title: z.string().optional(),
          code: z.object({ html: z.string(), css: z.string().optional() }),
        })
      )
      .default([]),
    blocks: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(["header","hero","features","services","testimonials","contact","map","tabs","footer"]),
          variant: z.string().default("default"),
          props: z.any(),
        })
      )
      .default([]),
  });
  const TargetSchema = (process.env.AI_PROVIDER || "openai").toLowerCase() === "gemini" ? GeminiCodeSiteSchema : CodeSiteOutputSchema;
  try {
    const { object } = await generateObject({
      model,
      schema: TargetSchema,
      messages: [
        {
          role: "system",
          content:
            "You are a website template rewriter. Given a base HTML/CSS template and structured business info, produce BRIGHT, FUN, accessible website code. Return ONLY JSON matching the schema with fields: siteId, theme, seo, code{html,css}, pages[]. Use the provided template as a starting point and adapt content, colors (vibrant, high-contrast), and sections to the business. Avoid external scripts/fonts. No JavaScript. HTML must be self-contained and mobile-friendly. Create multiple pages (at least Home '/', plus 2-4 others like '/about', '/services' or '/menu', '/contact') with consistent header nav linking to those paths.",
        },
        {
          role: "user",
          content: `Business details: ${summary}\n\nBase template HTML:\n${base.html}\n\nBase template CSS:\n${base.css}\n\nInstructions:\n- Build multiple pages with meaningful content for this business.\n- Header nav should link to '/', and the other pages you create.\n- Use bright, playful colors and gradients.\n- Replace placeholders with realistic business-specific content (e.g., menu/services/hours/address).\n- Keep all styles in CSS. No inline event handlers or scripts.\n- Output JSON only. Use siteId ${siteId}.`,
        },
      ],
    });
    const parsed = TargetSchema.safeParse(object);
    if (!parsed.success) {
      throw new Error("AI returned invalid schema");
    }
    return parsed.data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI generation failed:", msg);
    throw new Error(msg || "AI generation failed");
  }
}


