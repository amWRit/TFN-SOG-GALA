import Image from 'next/image';

export default function AboutEventHighlights() {
  return (
    <section className="py-8 px-4 md:px-16 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Event Highlights</h2>
      <div className="w-full max-w-3xl">
        <Image
          src="/samples/conceptnotes/noteimages/event-highlights.jpg"
          alt="Event Highlights"
          width={800}
          height={600}
          className="rounded shadow-lg w-full h-auto"
        />
      </div>
    </section>
  );
}
