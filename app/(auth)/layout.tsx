import { Globe, TrendingUp, Package } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 items-center justify-center p-12 relative overflow-hidden border-r">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-[420px] space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Grow with <span className="text-primary">Houses</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect your craftsmanship with thousands of design-conscious buyers.
              Join the premier marketplace for modern furniture.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:bg-background/80">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Marketplace Exposure</h3>
                <p className="text-sm text-muted-foreground">Reach thousands of active buyers daily</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:bg-background/80">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Sales Insights</h3>
                <p className="text-sm text-muted-foreground">Track views, clicks, and conversions</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border shadow-sm transition-all hover:bg-background/80">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Management</h3>
                <p className="text-sm text-muted-foreground">Effortless catalog and inventory control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-4 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}


