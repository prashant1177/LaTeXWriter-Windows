import {
  CirclePlus,
  Edit,
  FilePenLine,
  FileType2,
  Folder,
  MoveLeft,
  Trash,
  X,
} from "lucide-react";
import FolderTools from "./FolderTools";
import { useEffect, useState } from "react";
import api from "../../api";
import Input from "../../ui/Input/Input";
import { socket } from "../../socket";
import ToastLayout from "../../ui/Toast";

export default function FolderView({
  currFolder,
  setCurrFolder,
  currFile,
  setCurrFile,
  folders,
  setFolders,
  files,
  setFiles,
  saveFile,
  projectid,
  setLatex,
  setImageUrl,
}) {
  const [createNew, setCreateNew] = useState(null); // content state
  const [newName, setNewName] = useState("");
  const [backFolder, setBackFolder] = useState(null);
  const [rename, setRename] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fileHandler = ({ file }) => {
      setFiles((prev) => [...prev, file]); // 👈 update state
    };
    const folderHandler = ({ folder }) => {
      setFolders((prev) => [...prev, folder]); // 👈 update state
    };
    const fileDeletedHandler = ({ fileID }) => {
      setFiles((prev) => prev.filter((f) => f._id !== fileID));
    };
    const fileRenameHandler = ({ fileID, newName }) => {
      setFiles((prev) =>
        prev.map((f) => (f._id === fileID ? { ...f, name: newName } : f))
      ); // update name
    };
    const folderRenameHandler = ({ foldeerID, newName }) => {
      setFolders((prev) =>
        prev.map((f) => (f._id === foldeerID ? { ...f, name: newName } : f))
      );
    };
    const folderDeletedHandler = ({ foldeerID }) => {
      setFolders((prev) => prev.filter((f) => f._id !== foldeerID));
    };
    socket.on("folder-created", folderHandler);
    socket.on("file-created", fileHandler);
    socket.on("file-deleted", fileDeletedHandler);
    socket.on("file-renamed", fileRenameHandler);
    socket.on("folder-renamed", folderRenameHandler);
    socket.on("folder-deleted", folderDeletedHandler);

    return () => {
      socket.off("file-created", fileHandler);
      socket.off("folder-created", folderHandler);
      socket.off("file-deleted", fileDeletedHandler);
      socket.off("file-renamed", fileRenameHandler);
      socket.off("folder-renamed", folderRenameHandler);
      socket.off("folder-deleted", folderDeletedHandler);
    };
  }, []);
  const openFile = async (fileID, fileName) => {
    try {
      const ext = fileName.split(".").pop().toLowerCase();

      if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
        const res = await api.get(`/projects/getfile/${projectid}`, {
          params: { fileID },
          responseType: "arraybuffer",
        });
        const blob = new Blob([res.data], {
          type: res.headers["content-type"] || "image/*",
        });
        setImageUrl(URL.createObjectURL(blob));
        setCurrFile(fileID);
        return;
      }

      const res = await api.get(`/projects/getfile/${projectid}`, {
        params: { fileID },
      });
      setImageUrl(null);
      setLatex(res.data.fileContent);
      setCurrFile(fileID);
    } catch (error) {
      setToast("Failed to open file");
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const openFolder = async (folderID) => {
    try {
      const res = await api.get(`/projects/getfolder/${projectid}`, {
        params: { folderID: folderID },
      });
      setFolders(res.data.Folders);
      setBackFolder(res.data.parentId);
      setFiles(res.data.Files);
      setCurrFolder(folderID);
    } catch (error) {
      setToast("Failed to open folder");
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const newFile = async (filename) => {
    try {
      if (!filename.trim()) return;

      await api.post(`/projects/newfile/${projectid}`, {
        currFolder,
        filename,
      });

      setNewName("");
      setCreateNew(null);
      setToast("File Created Successfully");
    } catch (error) {
      setToast("Failed to create file");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const newFolder = async (foldername) => {
    try {
      if (!foldername.trim()) return;
      await api.post(`/projects/newfolder/${projectid}`, {
        currFolder,
        foldername,
      });
      setNewName("");
      setCreateNew(null);
      setToast("Folder Created Successfully");
    } catch (error) {
      setToast("Failed to create folder");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("currFolder", currFolder);
      await api.post(`/projects/uploadimage/${projectid}`, formData);
      setToast("Image Uploaded Successfully");
    } catch (error) {
      setToast("Failed to upload image");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("currFolder", currFolder);

      await api.post(`/projects/uploadfile/${projectid}`, formData);
      setToast("File Uploaded Successfully");
    } catch (error) {
      setToast("Failed to upload file");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const deleteFile = async (fileID) => {
    try {
      await api.post(`/projects/deleteFile/${projectid}`, {
        fileID,
      });
      setToast("File Deleted Successfully");
    } catch (error) {
      setToast("Failed to delete file");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const renameFile = async (fileID, filename) => {
    try {
      setRename(null);
      await api.post(`/projects/renamefile/${projectid}`, {
        fileID,
        filename,
      });
      setToast("File Renamed Successfully");
    } catch (error) {
      setToast("Failed to rename file");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const renameFolder = async (foldeerID, foldername) => {
    try {
      setRename(null);
      await api.post(`/projects/renamefolder/${projectid}`, {
        foldeerID,
        foldername,
      });
      setToast("Folder Renamed Successfully");
    } catch (error) {
      setToast("Failed to rename folder");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const deleteFolder = async (folderID) => {
    try {
      await api.post(`/projects/deleteFolder/${projectid}`, {
        folderID,
      });
      setToast("Folder Deleted Successfully");
    } catch (error) {
      setToast("Failed to delete folder");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  return (
    <div className="flex-1">
      {toast && <ToastLayout message={toast} />}

      <FolderTools
        saveFile={saveFile}
        setCreateNew={setCreateNew}
        projectid={projectid}
        uploadImage={uploadImage}
        uploadFile={uploadFile}
      />
      {!currFolder ? (
        <div className="flex flex-col text-gray-800">
          {" "}
          <div className="flex justify-between bg-gray-100 border-b-2 border-gray-200  px-8 animate-pulse">
            <button className={` p-2 flex gap-2 items-center `}>
              <FileType2 size={16} className={``} />
              Main.tex
            </button>
            <button className=" hover:text-red-500 transition-colors">
              <Trash strokeWidth={1} />{" "}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-gray-800">
          {createNew && (
            <div className="w-full flex items-center gap-4 mt-2  px-8">
              <Input
                className="border-2 border-blue-500"
                placeholder={
                  createNew === "folder"
                    ? "Enter folder name"
                    : "Enter file name"
                }
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <X
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setNewName("");
                  setCreateNew(null);
                }}
              />
              <CirclePlus
                className="text-green-500 cursor-pointer"
                onClick={() =>
                  createNew === "folder" ? newFolder(newName) : newFile(newName)
                }
              />
            </div>
          )}

          {folders?.map((folderInside, i) => (
            <div
              className="border-b-2 border-gray-200 p-2 flex gap-2 justify-between  px-8"
              key={i}
            >
              {" "}
              <button
                onClick={() => openFolder(folderInside._id)}
                className="flex gap-2 items-center"
                key={i}
              >
                <Folder size={16} />
                {rename && rename === folderInside._id ? (
                  <input
                    Value={folderInside.name}
                    autoFocus
                    onBlur={(e) =>
                      renameFolder(folderInside._id, e.target.value)
                    }
                    className="focus:outline-0 animate-pulse  [animation-iteration-count:1] "
                  />
                ) : (
                  folderInside.name
                )}
              </button>
              <div className="flex gap-2 items-center">
                <button
                  className={` hover:text-blue-500 transition-colors ${
                    rename === folderInside._id ? "text-blue-500" : null
                  }`}
                  onClick={() => (rename ? null : setRename(folderInside._id))}
                >
                  <FilePenLine strokeWidth={1} />
                </button>
                <button
                  className=" hover:text-red-500 transition-colors"
                  onClick={() => deleteFolder(folderInside._id)}
                >
                  <Trash strokeWidth={1} />{" "}
                </button>
              </div>
            </div>
          ))}
          {files?.map((filesInside, i) => (
            <div
              className="flex justify-between border-b-2 border-gray-200  px-8"
              key={i}
            >
              <button
                onClick={() => openFile(filesInside._id, filesInside.name)}
                className={` p-2 flex gap-2 items-center ${
                  currFile == filesInside._id && "text-blue-800"
                }`}
              >
                <FileType2 size={16} />
                {rename && rename === filesInside._id ? (
                  <input
                    Value={filesInside.name}
                    autoFocus
                    onBlur={(e) => renameFile(filesInside._id, e.target.value)}
                    className="focus:outline-0 animate-pulse  [animation-iteration-count:1] "
                  />
                ) : (
                  filesInside.name
                )}
              </button>
              <div className="flex gap-2 items-center">
                <button
                  className={` hover:text-blue-500 transition-colors ${
                    rename === filesInside._id ? "text-blue-500" : null
                  }`}
                  onClick={() => (rename ? null : setRename(filesInside._id))}
                >
                  <FilePenLine strokeWidth={1} />
                </button>
                <button
                  className=" hover:text-red-500 transition-colors"
                  onClick={() => deleteFile(filesInside._id)}
                >
                  <Trash strokeWidth={1} />{" "}
                </button>
              </div>
            </div>
          ))}
          {backFolder && (
            <button
              onClick={() => openFolder(backFolder)}
              className="border-y-1 border-gray-200 bg-gray-100 p-2 flex gap-2 items-center  px-8"
            >
              <MoveLeft size={16} />
              Go Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
