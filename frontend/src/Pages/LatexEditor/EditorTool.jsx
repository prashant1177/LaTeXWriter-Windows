import {
  FolderTree,
  FileText,
  Clock,
  Sigma,
  Sparkles,
  GitCommitVertical,
  House,
  Settings,
  Folder,
  CircleDot,
} from "lucide-react";
import api from "../../api";
import Button from "../../ui/Button/Button";
import { Link } from "react-router-dom";

export default function EditorTool({
  handleViewRight,
  handleViewLeft,
  leftView,
  rightView,
  compileLatexWithImage,
  loading,
  errLight
}) {
  return (
      <div className="flex w-full items-center gap-2 p-2 px-4 bg-gray-100 text-sm">
        <Link to={`/`}>
          {" "}
          <Button
            varient="transparent"
            className=" flex items-center gap-1 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
          >
            <House size={18} />
          </Button>{" "}
        </Link>

        <button
          onClick={() => handleViewLeft("PDF")}
          className={`${
            leftView == "PDF" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
        >
          <FileText size={18} />
        </button>
        <button
          onClick={() => handleViewLeft("files")}
          className={`${
            leftView == "files" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
        >
          <Folder size={18} />
        </button>

        <button
          className={`${
            leftView === "versions"
              ? "text-blue-600"
              : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
          onClick={() => handleViewLeft("versions")}
        >
          <Clock size={18} />
        </button>

        <button
          onClick={() => handleViewLeft("math")}
          className={`${
            leftView == "math" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
        >
          <Sigma size={18} />
        </button>

        <button
          onClick={() => handleViewLeft("Gemini")}
          className={`${
            leftView == "Gemini" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
        >
          <Sparkles size={18} />
        </button>

        <button
          varient="transparent"
          onClick={() => handleViewRight("commit")}
          className={`${
            rightView == "commit" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
       
        >
          <GitCommitVertical size={18} />
        </button>
        <button
          varient="transparent"
          onClick={() => handleViewRight("settings")}
          className={`${
            rightView == "settings" ? "text-blue-600" : "text-gray-950"
          } px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1`}
        >
          <Settings size={18} />
        </button>
        
                      <CircleDot className={`text-${errLight}-600 ms-auto `} />
        
        <Button
          onClick={() => compileLatexWithImage()}
          className="text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0 flex items-center gap-2 ms-2"
          varient="primary"
          disabled={loading}
        >
          {" "}
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          Compile PDF
        </Button>
      </div>
  );
}
