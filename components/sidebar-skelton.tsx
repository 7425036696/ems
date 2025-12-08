"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function SidebarSkeleton() {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card animate-pulse overflow-hidden"
      )}
    >
      <div className="h-full flex flex-col p-4">

        {/* Top Logo Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 bg-muted rounded-lg shimmer" />
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-24 bg-muted rounded shimmer" />
            <div className="h-3 w-16 bg-muted rounded shimmer" />
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-full bg-muted rounded-lg shimmer"
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-20 bg-muted rounded shimmer" />
          <div className="h-6 w-12 bg-muted rounded shimmer" />
        </div>

        {/* Logout Button */}
        <div className="h-9 w-full bg-muted rounded-lg shimmer" />
      </div>

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
    </div>
  );
}
