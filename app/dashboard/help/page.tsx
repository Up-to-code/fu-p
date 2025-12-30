"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help and find answers to common questions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Browse our documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find detailed guides and tutorials to help you get started.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

