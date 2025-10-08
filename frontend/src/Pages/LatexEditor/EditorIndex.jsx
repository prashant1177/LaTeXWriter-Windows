import { useEffect, useMemo, useRef, useState } from "react";
import EditorTool from "./EditorTool";
import PdfViewer from "./PdfViewer";
import FolderView from "./FolderView";
import api from "../../api";
import { useParams } from "react-router-dom";
import MonacoEditor from "./MonacoEditor";

import { debounce } from "lodash";
import Commit from "./Commit";
import Versions from "./Versions";
import PremiumIndex from "../Premium/PremiumIndex";
import MathSymbolsEditor from "./MathSymbolsEditor";
import AIChat from "./AIChat";
import { socket } from "../../socket";
import ProjectSettings from "./ProjectSettings";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { latex as CodeMirrorLatex } from "codemirror-lang-latex";
import { EditorView } from "@codemirror/view";

export default function EditorIndex() {
  const { projectid } = useParams(); // 👈 here you get "id" from the URL
  const [loading, setLoading] = useState(false);
  const [currFolder, setCurrFolder] = useState("");
  const [currfile, setCurrFile] = useState(null); // content state
  const [folders, setFolders] = useState([]); // content state
  const [files, setFiles] = useState([]); // content state
  const [isError, setIsError] = useState(false); // content state
  const [ErrorFix, setErrorFix] = useState(null);
  const [debug, setDebug] = useState(true);
  const [autoCompilation, setAutoCompilation] = useState(false);

  const [latex, setLatex] = useState("");
  const [leftView, setLeftView] = useState("PDF");
  const [rightView, setRightView] = useState("Editor");
  const [pdfUrl, setPdfUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [fetch, setFetch] = useState(false);
  const [errLight, SetErrLight] = useState("gray");

  const editorRef = useRef(null);
  const ydocRef = useRef(null);

  const [ytext, setYText] = useState(null);

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

        socket.auth = { token: localStorage.getItem("token") };
        if (!socket.connected) socket.connect();

        socket.emit("connect-to-project", projectid);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchData();
    compileLatexWithImage();
    return () => {
      socket.off("connect");
      socket.off("error");
    };
  }, [projectid]);

  const handleViewLeft = async (s) => {
    setLeftView(s);
  };
  const handleViewRight = (s) => {
    setRightView(s);
  };

  const compileLatexWithImage = async (writing = false) => {
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
      SetErrLight("blue");
      if(!writing){
        setRightView("PDF");
      }
    } catch (err) {
      if (writing) {
        SetErrLight("yellow");
      } else {
        alert("Error compiling project:");
        setIsError(true);
        setDebug(true);
        setErrorFix(err.stack);
        setPdfUrl("");
        SetErrLight("red");
      }
    } finally {
      setLoading(false);
    }
  };

  //  save file
  const saveFile = () => {
    socket.emit("save-file", { currfile });
    if (autoCompilation && !loading) {
      compileLatexWithImage(true);
    }
  };

  const debouncedCompile = debounce(saveFile, 1000);
  useEffect(() => {
    debouncedCompile();
    return () => {
      debouncedCompile.cancel(); // cleanup
    };
  }, [latex]);
  useEffect(() => {
    if (!socket || !currfile) return;
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const ytext = ydoc.getText(currfile);

    socket.emit("join-file", currfile);

    const handleInit = (update) => {
      if (update instanceof ArrayBuffer) {
        update = new Uint8Array(update);
      }
      Y.applyUpdate(ydoc, update);
    };

    const handleUpdate = (update) => {
      if (update instanceof ArrayBuffer) {
        update = new Uint8Array(update);
      }
      Y.applyUpdate(ydoc, update);
    };

    socket.on("init-doc", handleInit);
    socket.on("doc-update", handleUpdate);

    // Sync local updates → server
    ydoc.on("update", (update) => {
      socket.emit("doc-update", update);
    });

    // Pass Y.Text to codemirror
    setYText(ytext);

    return () => {
      // ✅ Cleanup only listeners

      socket.off("init-doc", handleInit);
      socket.off("doc-update", handleUpdate);

      ydoc.destroy();
    };
  }, [currfile, projectid]);
  const extensions = useMemo(() => {
    if (!ytext)
      return [
        CodeMirrorLatex({
          autoCloseTags: true,
          enableLinting: true,
          enableTooltips: true,
          latexHoverTooltip: true,
        }),
        EditorView.lineWrapping,
      ];

    return [
      CodeMirrorLatex({
        autoCloseTags: true,
        enableLinting: true,
        enableTooltips: true,
        latexHoverTooltip: true,
      }),
      EditorView.lineWrapping,
      yCollab(ytext),
    ];
  }, [ytext]);

  return (
    <div className="flex flex-col h-screen">
      

      <div className="flex flex-col-reverse md:flex-row flex-1  md:overflow-hidden">
        <div className="w-1/2 md:min-w-1/2 md:max-w-1/2">
        <EditorTool
          compileLatexWithImage={compileLatexWithImage}
          handleViewRight={handleViewRight}
          handleViewLeft={handleViewLeft}
          leftView={leftView}
          rightView={rightView}
          loading={loading}
            errLight={errLight}
        />
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
</div>
        <div className="flex-1 w-1/2 min-w-1/2 border-l-1 border-gray-200">
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
              setLatex={setLatex}
              editorRef={editorRef}
              fetch={fetch}
              imageUrl={imageUrl}
              extensions={extensions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
