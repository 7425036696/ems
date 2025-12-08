"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded shimmer" />
          <div className="h-4 w-72 bg-muted rounded shimmer" />
        </div>
        <div className="h-10 w-10 bg-muted rounded-lg shimmer" />
      </div>

      {/* Stats Grid (4 Cards) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-28 bg-muted rounded shimmer mb-2" />
              <div className="h-4 w-4 bg-muted rounded-full shimmer" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-20 bg-muted rounded shimmer mb-2" />
              <div className="h-3 w-32 bg-muted rounded shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Large Sections (Recent Leaves + Attendance) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded shimmer mb-2" />
              <div className="h-3 w-56 bg-muted rounded shimmer" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((x) => (
                <div key={x} className="flex justify-between items-center border border-border p-3 rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-muted rounded shimmer" />
                    <div className="h-3 w-44 bg-muted rounded shimmer" />
                  </div>
                  <div className="h-4 w-16 bg-muted rounded-full shimmer" />
                </div>
              ))}
              <div className="h-10 w-full bg-muted rounded-lg shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded shimmer mb-2" />
          <div className="h-3 w-56 bg-muted rounded shimmer" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 w-full h-28 border border-border rounded-lg bg-muted shimmer"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shimmer effect */}
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
