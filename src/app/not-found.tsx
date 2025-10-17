export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-neutral-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}


