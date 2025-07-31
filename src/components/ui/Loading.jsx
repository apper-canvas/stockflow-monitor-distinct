import React from "react";

const Loading = () => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-slate-200 rounded animate-shimmer w-48"></div>
        <div className="h-10 bg-slate-200 rounded animate-shimmer w-32"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="h-4 bg-slate-200 rounded animate-shimmer w-24 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded animate-shimmer w-16 mb-1"></div>
            <div className="h-3 bg-slate-200 rounded animate-shimmer w-20"></div>
          </div>
        ))}
      </div>

      {/* Search and filters skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-10 bg-slate-200 rounded animate-shimmer flex-1"></div>
        <div className="h-10 bg-slate-200 rounded animate-shimmer w-32"></div>
        <div className="h-10 bg-slate-200 rounded animate-shimmer w-32"></div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Table header */}
        <div className="border-b border-slate-200 p-4">
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-shimmer"></div>
            ))}
          </div>
        </div>
        
        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border-b border-slate-100 p-4">
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-16"></div>
              <div className="h-6 bg-slate-200 rounded-full animate-shimmer w-20"></div>
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-12"></div>
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-16"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-200 rounded animate-shimmer"></div>
                <div className="h-8 w-8 bg-slate-200 rounded animate-shimmer"></div>
                <div className="h-8 w-8 bg-slate-200 rounded animate-shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;