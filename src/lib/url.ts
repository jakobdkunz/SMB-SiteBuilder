export function getAbsoluteBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE_URL;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL; // e.g. my-app.vercel.app
  if (vercel) return `https://${vercel}`;
  const localhost = process.env.LOCAL_URL || "http://localhost:3000";
  return localhost;
}


