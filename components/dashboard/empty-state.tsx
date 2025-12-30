import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
    actionComponent?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon = PackageOpen,
    actionLabel,
    actionHref,
    actionComponent,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl bg-slate-50/50 min-h-[400px]", className)}>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {actionComponent ? (
                actionComponent
            ) : actionLabel && actionHref ? (
                <Link href={actionHref}>
                    <Button>{actionLabel}</Button>
                </Link>
            ) : null}
        </div>
    );
}
