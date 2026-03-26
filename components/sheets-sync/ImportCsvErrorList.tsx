import React from "react";

interface ImportCsvErrorListProps {
  errors: string[];
}

export const ImportCsvErrorList: React.FC<ImportCsvErrorListProps> = ({ errors }) => {
  if (!errors.length) return null;
  return (
    <div className="mt-4 text-red-600 text-sm">
      <div className="font-semibold mb-1">Errors:</div>
      <ul className="list-disc pl-5">
        {errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  );
};
