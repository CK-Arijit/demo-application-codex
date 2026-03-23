import { Card } from "@/components/ui/card";
import { SkeletonBlock } from "@/components/ui/skeleton";

export default function AccountSkeleton() {
  return (
    <Card as="div" className="p-5 md:p-6">
      <SkeletonBlock className="mb-5 h-6 w-40 rounded" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock className="h-12" key={index} />
        ))}
      </div>
      <SkeletonBlock className="mt-4 h-24" />
      <SkeletonBlock className="mt-5 h-11 w-32" />
    </Card>
  );
}
