import { CircleDot } from "lucide-react";
import Button from "../../ui/Button/Button";

export default function PdfTools({
  isChecked,
  setIsChecked,
  pdfUrl,
  setAutoCompilation,
  autoCompilation,
  errLight
}) {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

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
    <div className="w-full bg-gray-950 px-8 text-gray-300 text-sm flex items-center justify-between">
      <label className="inline-flex items-center cursor-pointer">
        {/* ✅ bind state and handler */}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div
          className="my-4 relative w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-4 
          peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 
          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
          after:start-[2px] after:bg-white after:border-gray-300 after:border 
          after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 
          peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
        ></div>
        <span className="ms-3 text-sm font-medium text-gray-300">
          Fast Preview Mode
        </span>
      </label>
      <div className="flex gap-4 items-center">
        <Button onClick={downloadpdf} className="text-gray-300">
          Download
        </Button>
        {autoCompilation ? (
          <Button
            onClick={() => setAutoCompilation(false)}
            className="text-gray-300"
            varient="primary"
          >
            Auto Compile
          </Button>
        ) : (
          <Button
            onClick={() => setAutoCompilation(true)}
            className="text-gray-300"
          >
            Auto Compile
          </Button>
        )}
        <CircleDot className={`text-${errLight}-600`} />
      </div>
    </div>
  );
}
