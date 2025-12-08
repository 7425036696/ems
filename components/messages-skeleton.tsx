"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MessagesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-40 bg-muted rounded shimmer mb-2" />
        <div className="h-4 w-64 bg-muted rounded shimmer" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <div className="h-10 w-24 bg-muted rounded shimmer" />
        <div className="h-10 w-24 bg-muted rounded shimmer" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - message list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="h-5 w-24 bg-muted rounded shimmer" />
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="space-y-2 border-b border-border pb-4 last:border-0"
                >
                  <div className="h-4 w-32 bg-muted rounded shimmer" />
                  <div className="h-3 w-48 bg-muted rounded shimmer" />
                  <div className="h-3 w-20 bg-muted rounded shimmer" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column - message thread */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="h-6 w-60 bg-muted rounded shimmer mb-2" />
              <div className="h-4 w-28 bg-muted rounded shimmer" />
            </CardHeader>

            <CardContent className="space-y-4 max-h-[550px] overflow-y-auto">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex justify-between text-xs">
                    <div className="h-3 w-24 bg-muted rounded shimmer" />
                    <div className="h-3 w-20 bg-muted rounded shimmer" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded shimmer" />
                    <div className="h-3 w-3/4 bg-muted rounded shimmer" />
                    <div className="h-3 w-1/2 bg-muted rounded shimmer" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer {
          0% {
            left: -150%;
          }
          100% {
            left: 150%;
          }
        }
      `}</style>
    </div>
  );
}
