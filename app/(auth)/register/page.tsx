"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
// Card imports removed
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  // Detect if this is an invite-based registration
  const isInviteMode = callbackUrl.startsWith("/join/");

  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");
  const [host, setHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  // Debounce check
  useEffect(() => {
    const checkSlug = async () => {
      if (!slug) {
        setIsSlugAvailable(null);
        setSlugError("");
        return;
      }
      // Simple regex validation
      if (!/^[a-z0-9-]+$/.test(slug)) {
        setSlugError("Slug can only contain lowercase letters, numbers, and dashes.");
        setIsSlugAvailable(false);
        return;
      }

      setIsCheckingSlug(true);
      try {
        const { checkSlugAvailability } = await import("@/app/actions/organization");
        const result = await checkSlugAvailability(slug);
        if (result.success && 'available' in result && result.available) {
          setIsSlugAvailable(true);
          setSlugError("");
        } else {
          setIsSlugAvailable(false);
          setSlugError((result as any).error || "Slug is already taken.");
        }
      } catch (error) {
        console.error("Check slug error", error);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Skip org validation for invite mode
    if (!isInviteMode && (isSlugAvailable === false || slugError)) {
      setError("Please choose a valid and unique Organization URL.");
      return;
    }

    try {
      await signup(email, password, name);

      // In invite mode, skip org creation and redirect to join page
      if (isInviteMode) {
        router.push(callbackUrl);
        return;
      }

      // Normal flow: Create organization
      const { createOrganizationAction } = await import("@/app/actions/organization");
      const result = await createOrganizationAction(companyName, slug);

      if (!result.success) {
        const errorMsg = (result as any).error || "Failed to create organization. Please try a different name.";
        console.error("Failed to create organization:", errorMsg);
        setError(errorMsg);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isInviteMode ? "Join your team" : "Create an account"}
        </h1>
        <p className="text-muted-foreground">
          {isInviteMode
            ? "Create your account to join the organization"
            : "Enter your information to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-lg">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 bg-background/50 border-input hover:border-ring/50 transition-colors"
            />
          </div>

          {/* Only show org fields if NOT in invite mode */}
          {!isInviteMode && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Furniture"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (!slugManuallyEdited) {
                    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setSlug(newSlug);
                  }
                }}
                required
                disabled={isLoading}
                className="h-12 bg-background/50 border-input hover:border-ring/50 transition-colors"
              />
            </div>
          )}

          {!isInviteMode && (
            <div className="space-y-2">
              <Label htmlFor="slug">Organization URL</Label>
              <div className="flex rounded-md shadow-sm relative">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground text-sm h-12">
                  {host ? host : "app"}/
                </span>
                <Input
                  id="slug"
                  placeholder="acme-furniture"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                    setSlugError("");
                  }}
                  required
                  disabled={isLoading}
                  className={`h-12 bg-background/50 border-input hover:border-ring/50 transition-colors rounded-l-none ${slugError ? "border-red-500 focus-visible:ring-red-500" : isSlugAvailable === true ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                />
                <div className="absolute right-3 top-3.5">
                  {isCheckingSlug ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : isSlugAvailable === true && slug ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : slugError ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              </div>
              {slugError && <p className="text-xs text-red-500">{slugError}</p>}
              <p className="text-xs text-muted-foreground">
                Unique identifier for your organization's URL. {isSlugAvailable === true && slug && <span className="text-green-600 font-medium">Available!</span>}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 bg-background/50 border-input hover:border-ring/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="h-12 bg-background/50 border-input hover:border-ring/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="h-12 bg-background/50 border-input hover:border-ring/50 transition-colors"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="mt-4 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
