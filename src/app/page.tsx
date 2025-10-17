import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-6">
        <div className="font-bold">SMB SiteBuilder</div>
        <nav className="flex gap-4">
          <Link href="/sign-in" className="text-sm">Sign in</Link>
          <Link href="/sign-up" className="text-sm">Sign up</Link>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold">Generate a modern website for your small business</h1>
          <p className="mt-4 text-neutral-600">Start from a beautiful template and let AI customize it with your business details.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/sign-up" className="bg-black text-white px-5 py-3 rounded">Get started</Link>
            <Link href="/sign-in" className="border px-5 py-3 rounded">I have an account</Link>
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-sm text-neutral-600">Preview of generated site</p>
          <div className="mt-3 h-40 bg-neutral-100 rounded" />
        </div>
      </main>
    </div>
  );
}
