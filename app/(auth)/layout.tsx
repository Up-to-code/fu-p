export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-primary">Start Kit</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Build modern applications faster with our complete starter kit.
              Get started in minutes, not hours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur border">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur border">
              <div className="text-2xl font-bold text-primary">Fast</div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur border">
              <div className="text-2xl font-bold text-primary">Secure</div>
              <div className="text-sm text-muted-foreground">By Default</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur border">
              <div className="text-2xl font-bold text-primary">Modern</div>
              <div className="text-sm text-muted-foreground">Stack</div>
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


