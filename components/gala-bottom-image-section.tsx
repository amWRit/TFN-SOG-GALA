import React from 'react';

const GalaBottomImageSection = () => {
  return (
    <section className="relative w-full h-[350px] md:h-[420px] lg:h-[500px] flex items-end justify-center overflow-hidden">
      <img
        src="/images/home_bottom_image.png"
        alt="Children at school in Nepal"
        className="absolute inset-0 w-full h-full object-cover object-bottom grayscale"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <a
            href="#about-gala"
            className="bg-white/90 text-[#084691] font-semibold px-8 py-3 rounded-full text-lg shadow hover:bg-white transition"
          >
            About the Gala
          </a>
          <a
            href="https://forms.gle/your-google-form-link" // TODO: Replace with actual link
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#d71a21] text-white font-semibold px-8 py-3 rounded-full text-lg shadow hover:bg-[#b81519] transition"
          >
            Register
          </a>
          <a
            href="/program"
            className="bg-white/90 text-[#084691] font-semibold px-8 py-3 rounded-full text-lg shadow hover:bg-white transition"
          >
            View Program Details
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />
    </section>
  );
};

export default GalaBottomImageSection;
