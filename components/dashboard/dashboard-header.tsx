"use client";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus, Users, BarChart3 } from "lucide-react";
import { GlobalSearch } from "./global-search";
import { Protect } from "./protect";
import Link from "next/link";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-2">
        <Protect permission="products.create">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Add Product">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </Protect>

        <Protect permission="users.invite">
          <Link href="/dashboard/employees">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Invite Team">
              <Users className="h-5 w-5" />
            </Button>
          </Link>
        </Protect>

        <Link href="/dashboard/analytics">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Analytics">
            <BarChart3 className="h-5 w-5" />
          </Button>
        </Link>

        <div className="h-6 w-px bg-border/50 mx-1" />

        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
        </Button>
      </div>
    </header>
  );
}

