"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage your documents and files
          </p>
        </div>
        <Button className="rounded-lg">
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>All your documents in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Document 1</p>
                <p className="text-sm text-muted-foreground">Created 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Document 2</p>
                <p className="text-sm text-muted-foreground">Created 1 week ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

