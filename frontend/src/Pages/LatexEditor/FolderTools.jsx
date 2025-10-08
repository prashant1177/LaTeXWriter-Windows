import { FolderPlus, FilePlus, Upload, ImagePlus, Save } from "lucide-react";

export default function FolderTools({
  saveFile,
  setCreateNew,
  uploadImage,
  uploadFile,
}) {
  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 px-2 sm:px-4 lg:px-8 py-2 text-gray-300 text-sm">
      <div className="flex items-center  gap-2 sm:gap-4 lg:gap-6 text-gray-300 h-full">
        {/* New Folder */}
        <button
          onClick={() => setCreateNew("folder")}
          className="group flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FolderPlus size={16} />
          <span className="">New Folder</span>
        </button>

        {/* Divider */}

        {/* New File */}
        <button
          onClick={() => setCreateNew("file")}
          className="group flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FilePlus size={16} />
          <span className="">New File</span>
        </button>

        {/* Divider */}

        {/* Upload File */}
        <label className=" group flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Upload size={16} />
          <span className="">Upload File</span>
          <input
            type="file"
            accept=".tex,.bib,.cls,.sty,.txt"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                uploadFile(e.target.files[0]);
              }
            }}
          />
        </label>
        {/* Divider */}

        {/* Upload Image */}
        <label className=" group flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <ImagePlus size={16} />
          <span className="">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                uploadImage(e.target.files[0]);
              }
            }}
          />
        </label>

        {/* Divider */}

        {/* Save File */}
        <button
          onClick={() => saveFile()}
          className="group flex items-center gap-1 p-1.5 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Save size={16} />
          <span className="">Save File</span>
        </button>
      </div>
    </div>
  );
}
