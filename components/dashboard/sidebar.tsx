"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dashboardNavItems, type NavGroup } from "@/lib/dashboard/nav-items";
import { LogOut } from "lucide-react";

interface SidebarProps {
  navItems?: NavGroup[];
}

import { useOrgStore } from "@/store/org-store";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar({ navItems = dashboardNavItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { organization, isLoading: isOrgLoading } = useOrgStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const orgName = organization?.name || "Houses";
  const orgInitial = orgName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-3">
          {isOrgLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black shadow-sm text-sm">
                {orgInitial}
              </div>
              <span className="tracking-tight truncate max-w-[140px]">{orgName}</span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {group.title && (
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-70">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {groupIndex < navItems.length - 1 && (
              <Separator className="my-4 mx-2 w-auto bg-border/40" />
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image ?? ""} alt={user?.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <p className="text-[10px] uppercase font-bold text-primary mt-1 border border-primary/20 bg-primary/5 rounded px-1.5 py-0.5 inline-block w-fit">
              {user?.role || "Viewer"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

