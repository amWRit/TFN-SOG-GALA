import { CSV_HEADERS, CSV_SAMPLE_ROW } from "./csvConstants";

export function getHandleDownloadSample(csvHeaders = CSV_HEADERS, csvSampleRow = CSV_SAMPLE_ROW) {
  const csvSample = `${csvHeaders.join(',')}` + "\n" + `${csvSampleRow.join(',')}`;
  return () => {
    const blob = new Blob([csvSample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-registrations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}
