import Image from 'next/image';

export default function AboutTruthHope() {
  return (
    <section className="py-8 px-4 md:px-16 bg-blue-50 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Facing the Truth, Inspiring Hope</h2>
      <div className="w-full max-w-3xl">
        <Image
          src="/samples/conceptnotes/noteimages/a-new-year.jpg"
          alt="A New Year. A Moment of Truth. A Reason for Hope."
          width={800}
          height={600}
          className="rounded shadow-lg w-full h-auto"
        />
      </div>
    </section>
  );
}
