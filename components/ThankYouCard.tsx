import React from "react";

export default function ThankYouCard() {
  return (
    <div
      className="mt-8 w-full rounded-2xl overflow-hidden shadow-2xl border border-yellow-400/30"
      style={{
        background: "linear-gradient(135deg, #1a2540 0%, #0c1a3a 60%, #1a1a0a 100%)",
      }}
    >
      <div className="flex flex-col items-center px-2 py-5 text-center relative">
        {/* Stars decoration */}
        <div className="absolute top-4 left-6 text-2xl opacity-60 select-none">✨</div>
        <div className="absolute top-4 right-6 text-2xl opacity-60 select-none">✨</div>
        <div className="absolute bottom-4 left-10 text-xl opacity-40 select-none">🌟</div>
        <div className="absolute bottom-4 right-10 text-xl opacity-40 select-none">🌟</div>

        <div className="text-4xl mb-3">🙏</div>
        <h3 className="text-2xl md:text-4xl font-extrabold text-yellow-300 mb-0 tracking-tight drop-shadow">
          Thank You!
        </h3>
      </div>
    </div>
  );
}
