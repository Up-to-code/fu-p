"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface NavProps {
  variant?: "landing" | "dashboard";
}

export function Nav({ variant = "landing" }: NavProps) {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (variant === "dashboard") {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Start Kit
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {user && (
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-lg">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Start Kit
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#features">
              <Button variant="ghost">Features</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-lg">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

