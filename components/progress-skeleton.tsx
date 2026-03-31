import React from "react";

export default function ProgressSkeleton() {
  return (
    <div className="min-h-screen bg-[#07122b] flex flex-col items-center justify-center px-4 py-8 animate-pulse">
      <div className="w-full max-w-3xl">
        <div className="h-8 md:h-12 w-2/3 mx-auto bg-[#22305a] rounded mb-4" />
        <div className="h-6 md:h-8 w-1/3 mx-auto bg-yellow-900 rounded mb-8" />
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 md:h-24 w-1/2 bg-[#22305a] rounded mb-2" />
          <div className="h-8 w-1/4 bg-yellow-900 rounded" />
        </div>
        <div className="relative w-full h-10 rounded-full bg-[#1a2540] overflow-hidden mb-4 border-2 border-[#22305a]">
          <div className="absolute left-0 top-0 h-full bg-blue-900" style={{ width: '60%' }} />
          <div className="absolute left-0 top-0 h-full bg-red-900 opacity-70" style={{ width: '30%' }} />
          <div className="absolute top-0 h-full border-l-4 border-yellow-900" style={{ left: 'calc(100% - 2px)' }} />
        </div>
        <div className="flex justify-between text-white text-sm md:text-base font-medium mb-8">
          <span className="hidden md:flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-blue-900" />
            <span className="font-bold ml-2 bg-[#22305a] rounded w-16 h-4 inline-block" />
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-red-900" />
            <span className="font-bold ml-2 bg-[#22305a] rounded w-16 h-4 inline-block" />
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-yellow-900" />
            <span className="font-bold ml-2 bg-[#22305a] rounded w-16 h-4 inline-block" />
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8 bg-[#101b36] rounded-lg py-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-10 md:h-14 w-2/3 mx-auto bg-[#22305a] rounded mb-2" />
              <div className="h-4 w-1/2 mx-auto bg-[#22305a] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
