import Image from "next/image";

/**
 * The Sakha AI brand lockup (infinity mark + wordmark) from /public/sakhaai.svg.
 * Control size with a height class, e.g. `className="h-10 w-auto"`.
 */
export function SakhaLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/sakhaai.svg"
      alt="Sakha AI"
      width={280}
      height={230}
      priority
      unoptimized
      className={className}
    />
  );
}
