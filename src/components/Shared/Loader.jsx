import React from 'react';

export default function Loader({ count = 3 }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-white dark:bg-govMatte-darkCard border border-govMatte-border/60 dark:border-govMatte-darkBorder/40 rounded-2xl p-5 space-y-3 relative overflow-hidden"
        >
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
