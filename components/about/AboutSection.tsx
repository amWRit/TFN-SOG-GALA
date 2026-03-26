import React from 'react';

interface SectionProps {
  id?: string;
  title: string;
  image?: string;
  children: React.ReactNode;
  bg?: string;
}

export default function AboutSection({ id, title, image, children, bg }: SectionProps) {
  return (
    <section id={id} className={`py-12 px-4 md:px-16 ${bg || ''} flex flex-col items-center`}>
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">{title}</h2>
      {image && (
        <img
          src={image}
          alt={title}
          className="rounded shadow-lg w-full max-w-3xl h-auto mb-6"
        />
      )}
      <div className="w-full max-w-3xl text-lg leading-relaxed text-gray-800">
        {children}
      </div>
    </section>
  );
}
