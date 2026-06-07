import type { Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BadgeKondisi({ condition, conditionLabel, className }: Pick<Product, "condition" | "conditionLabel"> & { className?: string }) {
  const styles: Record<Product["condition"], string> = {
    mulus: "bg-green-100 text-green-700 border-green-300",
    normal: "bg-blue-100 text-blue-700 border-blue-300",
    "ori-copotan": "bg-blue-100 text-blue-700 border-blue-300",
    compatible: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };
  const prefix = condition === "compatible" ? "" : "✓ ";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        styles[condition],
        className
      )}
    >
      {prefix}
      {conditionLabel}
    </span>
  );
}
