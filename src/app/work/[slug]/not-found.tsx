import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-[100dvh] items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Case Study Not Found</h1>
      <p className="text-muted-foreground">
        The case study you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Work Experience
      </Link>
    </main>
  );
}



