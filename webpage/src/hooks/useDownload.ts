/**
 * Custom hook for handling file download.
 *
 * @returns A function that triggers the download of a file.
 */
export default function useDownload() {
  const handleDownload = () => {
    const jsonUrl = 'glyphs.json';
    const link = document.createElement('a');
    link.href = jsonUrl;
    link.download = 'glyphs.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return handleDownload;
}
