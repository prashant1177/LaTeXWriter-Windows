import LaTeXToolbar from "./LatexToolbar";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { useEffect, useState } from "react";

// Enhanced Monaco Editor Component with Toolbar
export default function MonacoEditor({
  setLatex,
  editorRef,
  fetch,
  imageUrl,
  extensions,
}) {
  const [fontSize, setFontSize] = useState(14);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "+") {
        setFontSize((s) => s + 1);
        e.preventDefault();
      } else if (e.ctrlKey && e.key === "-") {
        setFontSize((s) => Math.max(8, s - 1));
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const fontTheme = EditorView.theme({
    "&": {
      fontSize: `${fontSize}px`,
    },
    ".cm-content": {
      fontSize: `${fontSize}px`,
    },
  });

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
        <div className="flex-1 overflow-auto style-4">
          {imageUrl ? (
            <img src={imageUrl} alt="Image" />
          ) : (
            <CodeMirror
              onChange={setLatex}
              onCreateEditor={(view) => {
                editorRef.current = view;
              }}
              extensions={[fontTheme, ...extensions]}
            />
          )}{" "}
        </div>
      )}
    </div>
  );
}
