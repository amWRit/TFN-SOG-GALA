import Image from 'next/image';

export default function AboutExecutiveSummary() {
  return (
    <section className="py-8 px-4 md:px-16 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Our Mission & Impact</h2>
      <div className="w-full max-w-3xl">
        <Image
          src="/samples/conceptnotes/noteimages/executive-summary.jpg"
          alt="Executive Summary"
          width={800}
          height={600}
          className="rounded shadow-lg w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
