"use client";

import { Card } from "@/components/ui/card";

export default function UsersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div>
        <div className="h-7 w-40 bg-muted rounded shimmer mb-2" />
        <div className="h-4 w-64 bg-muted rounded shimmer" />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 bg-muted rounded shimmer" />
        <div className="h-10 w-full bg-muted rounded shimmer" />
      </div>

      {/* Users Table */}
      <Card className="border border-border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 px-6 py-3 border-b border-border bg-muted/20">
          <div className="h-4 w-16 bg-muted rounded shimmer" />
          <div className="h-4 w-20 bg-muted rounded shimmer" />
          <div className="h-4 w-16 bg-muted rounded shimmer" />
          <div className="h-4 w-24 bg-muted rounded shimmer" />
          <div className="h-4 w-12 bg-muted rounded shimmer justify-self-end" />
        </div>

        {/* Table Rows */}
        <div className="space-y-3 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-5 items-center px-6 py-4 border-b border-border last:border-0"
            >
              <div className="h-4 w-24 bg-muted rounded shimmer" />
              <div className="h-4 w-32 bg-muted rounded shimmer" />
              <div className="h-4 w-12 bg-muted rounded shimmer" />
              <div className="h-4 w-28 bg-muted rounded shimmer" />
              <div className="flex justify-end">
                <div className="h-8 w-8 bg-muted rounded shimmer mr-2" />
                <div className="h-8 w-8 bg-muted rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Shimmer CSS */}
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
