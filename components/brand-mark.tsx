import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      aria-hidden="true"
      width={512}
      height={512}
      className={cn("shrink-0 rounded-sm", className)}
    />
  );
}
