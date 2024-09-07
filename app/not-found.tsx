import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex justify-center items-center text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">
          <Button variant="secondary" className="rounded-xl mt-2">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
