import Image from 'next/image';

export default function AboutObjectives() {
  return (
    <section className="py-8 px-4 md:px-16 bg-blue-800 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Gala Objectives</h2>
      <div className="w-full max-w-3xl">
        <Image
          src="/samples/conceptnotes/noteimages/objectives.jpg"
          alt="Objectives of the Truth and Hope Gala"
          width={800}
          height={600}
          className="rounded shadow-lg w-full h-auto"
        />
      </div>
    </section>
  );
}
