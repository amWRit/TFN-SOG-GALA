import Link from 'next/link';

export default function AboutReadMoreButton() {
  return (
    <div className="flex justify-center my-10">
      <Link href="/samples/conceptnotes/TFN-Truth-and-Hope-Gala-2026-Concept-Note.pdf" target="_blank" rel="noopener noreferrer">
        <button className="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg shadow transition-all duration-200">
          Read the Full Concept Note
        </button>
      </Link>
    </div>
  );
}
