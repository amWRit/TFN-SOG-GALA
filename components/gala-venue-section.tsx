import React from 'react';

const GalaVenueSection = () => {
  return (
    <section className="w-full bg-[#d71a21] text-white py-12 flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl px-4">
        <div className="flex flex-col items-center md:items-end flex-1">
          <h3 className="text-2xl font-semibold mb-2">Hotel Yak & Yeti</h3>
          <div className="text-6xl font-bold mb-2">10</div>
          <div className="text-lg font-medium mb-2">APRIL, 2026</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <img src="/images/qr-register.png" alt="Register QR" className="w-40 h-40 mb-2 rounded-lg border-4 border-white shadow-lg" />
          <a
            href="https://forms.gle/your-google-form-link" // TODO: Replace with actual link
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-white text-[#d71a21] font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-gray-100 transition"
          >
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default GalaVenueSection;
