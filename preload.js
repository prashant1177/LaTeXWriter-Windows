const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveProject: (projectData) => ipcRenderer.invoke("save-project", projectData),
  compileProject: (compileData) => ipcRenderer.invoke("compile-project", compileData),
  
});
