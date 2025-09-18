import { useEffect, useRef, useState } from "react";
import EditorTool from "./EditorTool";
import PdfViewer from "./PdfViewer";
import FolderView from "./FolderView";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import MonacoEditor from "./MonacoEditor";

import { debounce } from "lodash";
import Commit from "./Commit";
import Versions from "./Versions";
import PremiumIndex from "../Premium/PremiumIndex";
import MathSymbolsEditor from "./MathSymbolsEditor";
import AIChat from "./AIChat";
import { socket } from "../../socket";
import ProjectSettings from "./ProjectSettings";

export default function EditorIndex() {
  const { projectid } = useParams(); // 👈 here you get "id" from the URL
  const [loading, setLoading] = useState(false);
  const [currFolder, setCurrFolder] = useState("");
  const [currfile, setCurrFile] = useState({}); // content state
  const [folders, setFolders] = useState([]); // content state
  const [files, setFiles] = useState([]); // content state
  const [isError, setIsError] = useState(false); // content state
  const [ErrorFix, setErrorFix] = useState({});
  const [debug, setDebug] = useState(true);
  const [autoCompilation, setAutoCompilation] = useState(false);

  const [leftView, setLeftView] = useState("files");
  const [rightView, setRightView] = useState("Editor");
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [latex, setLatex] = useState("Loading your content...");
  const [fetch, setFetch] = useState(false);
  const editorRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetch(true);
        const res = await api.get(`/projects/loadEditor/${projectid}`);
        setFolders(res.data.Folders);
        setFiles(res.data.Files);
        setCurrFolder(res.data.rootFolder);
        setCurrFile(res.data.rootFile._id);
        setFetch(false);
        setLatex(res.data.fileContent);

        socket.auth = { token: localStorage.getItem("token") };
        if (!socket.connected) socket.connect();
        socket.emit("connect-to-project", projectid);

        socket.on("connect", () => {
          console.log("Socket connected!");
        });

        socket.on("error", (msg) => {
          console.error("Socket error:", msg);
        });
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchData();
    return () => {
      socket.off("connect");
      socket.off("error");
    };
  }, [projectid]);

  useEffect(() => {
    const handler = ({ currfile: updatedFile, latex }) => {
      if (updatedFile === currfile && editorRef.current) {
        const editor = editorRef.current;
        const model = editor.getModel();

        if (model && model.getValue() !== latex) {
          const currentSelection = editor.getSelection();

          model.applyEdits([
            {
              range: model.getFullModelRange(),
              text: latex,
              forceMoveMarkers: true,
            },
          ]);

          if (currentSelection) {
            editor.setSelection(currentSelection);
          }
        }
      }
    };

    socket.on("file-updated", handler);
    return () => socket.off("file-updated", handler);
  }, [currfile]);

  const handleViewLeft = async (s) => {
    /*  if (s === "math") {
      try {
        const res = await api.get("/api/checkpremium");

        if (!res.data.isPremium) {
          setLeftView("premium");
          return;
        }
      } catch (err) {
        console.error("Error checking premium:", err);

        setLeftView("premium");
        return;
      }
    } */
    setLeftView(s);
  };
  const handleViewRight = (s) => {
    setRightView(s);
  };

  const compileLatexWithImage = async () => {
    try {
      setLoading(true);

      // 1. Fetch files and folders from backend
      const res = await api.get(`/projects/getdata/${projectid}`);
      const { folders, files, rootFolder, rootFile } = res.data;

      // 2. Ask Electron main process to write/update local project
      const projectPath = await window.electronAPI.saveProject({
        projectId: projectid,
        folders: folders,
        files: files,
        rootFolder,
      });

      // 3. Compile project locally using Electron IPC
      const pdfBuffer = await window.electronAPI.compileProject({
        projectPath,
        mainFileName: rootFile.name,
      });
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });

      // 4. Display PDF
      setPdfUrl(URL.createObjectURL(blob));
      setIsError(false);
    } catch (err) {
      alert("Error compiling project:");
      setIsError(true);
      setDebug(true);
      setErrorFix(err.stack);
      setPdfUrl("");
    } finally {
      setLoading(false);
    }
  };

  //  save file
  const saveFile = () => {
    socket.emit("edit-file", { currfile, latex });
    if (autoCompilation) {
      compileLatexWithImage();
    }
  };
  const debouncedCompile = debounce(saveFile, 800);
  useEffect(() => {
    debouncedCompile();

    return debouncedCompile.cancel;
  }, [latex]);
  function handleEditorMount(editor, monaco) {
    monaco.editor.setTheme("latexThemeOverleaf");
    editorRef.current = editor;
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="shrink-0">
        <EditorTool
          compileLatexWithImage={compileLatexWithImage}
          handleViewRight={handleViewRight}
          handleViewLeft={handleViewLeft}
          leftView={leftView}
          rightView={rightView}
          loading={loading}
        />
      </div>

      <div className="flex flex-col-reverse  md:flex-row flex-1 md:overflow-hidden">
        {leftView == "PDF" ? (
          <PdfViewer
            pdfUrl={pdfUrl}
            loading={loading}
            isError={isError}
            setErrorFix={setErrorFix}
            ErrorFix={ErrorFix}
            setDebug={setDebug}
            debug={debug}
            compileLatexWithImage={compileLatexWithImage}
            setAutoCompilation={setAutoCompilation}
            autoCompilation={autoCompilation}
          />
        ) : leftView == "versions" ? (
          <Versions projectid={projectid} />
        ) : leftView == "math" ? (
          <MathSymbolsEditor editorRef={editorRef} />
        ) : leftView == "Gemini" ? (
          <AIChat />
        ) : leftView == "premium" ? (
          <PremiumIndex />
        ) : (
          <FolderView
            saveFile={saveFile}
            projectid={projectid}
            setLatex={setLatex}
            currFolder={currFolder}
            setCurrFolder={setCurrFolder}
            currFile={currfile}
            setCurrFile={setCurrFile}
            folders={folders}
            setFolders={setFolders}
            files={files}
            setFiles={setFiles}
            setImageUrl={setImageUrl}
          />
        )}

        <div className="flex-1 border-l-1 border-gray-200">
          {rightView == "commit" ? (
            <>
              {" "}
              <Commit projectid={projectid} handleViewRight={handleViewRight} />
            </>
          ) : rightView == "settings" ? (
            <>
              {" "}
              <ProjectSettings
                projectid={projectid}
                handleViewRight={handleViewRight}
              />
            </>
          ) : (
            <MonacoEditor
              latex={latex}
              setLatex={setLatex}
              handleEditorMount={handleEditorMount}
              editorRef={editorRef}
              fetch={fetch}
              imageUrl={imageUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}
