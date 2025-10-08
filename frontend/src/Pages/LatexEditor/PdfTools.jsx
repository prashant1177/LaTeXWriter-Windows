import { Download } from "lucide-react";
import Button from "../../ui/Button/Button";

export default function PdfTools({
  isChecked,
  setIsChecked,
  pdfUrl,
  setAutoCompilation,
  autoCompilation,
}) {
  const downloadpdf = async () => {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 px-2 sm:px-4 lg:px-8 py-2 text-gray-300 text-sm flex items-center justify-between">
      <div className="flex gap-6 items-center">
        <label className="text-gray-800 flex items-center gap-2 cursor-pointer">
          <input
            className="text-gray-300"
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          Preview Mode{" "}
        </label>
        <label className="text-gray-800 flex items-center gap-2 cursor-pointer">
          <input
            className="text-gray-300"
            type="checkbox"
            checked={autoCompilation}
            onChange={() => setAutoCompilation(!autoCompilation)}
          />
          Auto Compile
        </label>
      </div>
        <button
         onClick={downloadpdf}
          className="flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Download size={16} />
          <span className="">Download</span>
        </button>
    </div>
  );
}
