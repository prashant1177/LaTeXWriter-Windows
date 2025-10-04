import LaTeXToolbar from "./LatexToolbar";
import CodeMirror from "@uiw/react-codemirror";

// Enhanced Monaco Editor Component with Toolbar
export default function MonacoEditor({
  editorRef,
  fetch,
  imageUrl,
  extensions,
}) {
  return (
    <div className="flex flex-col h-full ">
      <LaTeXToolbar editorRef={editorRef} />
      {fetch ? (
        <div role="status" className="space-y-2.5 animate-pulse flex-1 p-8">
          <div className="flex items-center w-full">
            <div className="h-2.5 bg-gray-100 rounded-full  w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[480px]">
            <div className="h-2.5 bg-gray-100 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-24"></div>
          </div>
          <div className="flex items-center w-full max-w-[400px]">
            <div className="h-2.5 bg-gray-200 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-100 rounded-full  w-80"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[480px]">
            <div className="h-2.5 ms-2 bg-gray-100 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-24"></div>
          </div>
          <div className="flex items-center w-full max-w-[440px]">
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-32"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-24"></div>
            <div className="h-2.5 ms-2 bg-gray-100 rounded-full  w-full"></div>
          </div>
          <div className="flex items-center w-full max-w-[360px]">
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
            <div className="h-2.5 ms-2 bg-gray-100 rounded-full  w-80"></div>
            <div className="h-2.5 ms-2 bg-gray-200 rounded-full  w-full"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {imageUrl ? (
            <img src={imageUrl} alt="Image" />
          ) : (
            <CodeMirror
              onCreateEditor={(view) => {
                editorRef.current = view;
              }}
              extensions={extensions}
            />
          )}{" "}
        </div>
      )}
    </div>
  );
}
