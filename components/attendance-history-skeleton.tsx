"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AttendanceHistorySkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 w-40 bg-muted rounded shimmer mb-2" />
        <div className="h-4 w-60 bg-muted rounded shimmer" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded shimmer" />
              <div className="h-3 w-48 bg-muted rounded shimmer" />
            </div>

            <div className="text-right space-y-2">
              <div className="h-4 w-12 bg-muted rounded shimmer" />
              <div className="h-3 w-20 bg-muted rounded shimmer" />
            </div>
          </div>
        ))}
      </CardContent>

      {/* Shimmer Effect */}
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
    </Card>
  );
}
