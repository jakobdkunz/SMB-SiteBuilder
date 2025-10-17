export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Dashboard() {
  await auth.protect();
  const user = await currentUser();
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.firstName || "there"}</h1>
      <div className="mt-6 flex gap-4">
        <Link href="/generate" className="bg-black text-white px-4 py-2 rounded">New Site</Link>
        <Link href="/import" className="border px-4 py-2 rounded">Import Existing</Link>
      </div>
    </div>
  );
}


