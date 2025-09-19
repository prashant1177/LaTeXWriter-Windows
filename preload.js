const { contextBridge, ipcRenderer,shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveProject: (projectData) => ipcRenderer.invoke("save-project", projectData),
  compileProject: (compileData) => ipcRenderer.invoke("compile-project", compileData),
  openExternal: (url) => shell.openExternal(url),
});
