import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
    return (
        <div className="p-6 space-y-6">
            <Skeleton className="h-9 w-32 mb-6" />

            <div className="border rounded-lg">
                <div className="p-4 border-b">
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                    </div>
                </div>
                <div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 border-b last:border-0 flex gap-4 items-center">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-24 rounded-md ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
