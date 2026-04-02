import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2540] to-[#07122b] px-4">
      <div className="text-7xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg">404</div>
      <div className="text-2xl md:text-3xl font-bold text-white mb-2">Page Not Found</div>
      <div className="text-lg text-gray-300 mb-8 text-center max-w-md">
        Sorry, the page you are looking for does not exist or you do not have permission to view it.
      </div>
      <a
        href="/"
        className="px-6 py-3 rounded-full bg-yellow-400 text-[#1a2540] font-semibold text-lg shadow hover:bg-yellow-300 transition-all"
      >
        Go Home
      </a>
    </div>
  );
}
