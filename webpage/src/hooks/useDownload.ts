export default function useDownload() {
  const handleDownload = () => {
    const jsonUrl = import.meta.env.VITE_FILE;
    const link = document.createElement('a');
    link.href = jsonUrl;
    link.download = import.meta.env.VITE_FILE;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return handleDownload;
}
