"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
  const convex = useMemo(() => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || ""), []);
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </ClerkProvider>
  );
}


