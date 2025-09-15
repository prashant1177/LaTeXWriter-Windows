const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const isDev = true; // change to false in prod
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // 👈 preload for IPC
    },
  });

  const startUrl = isDev
    ? "http://localhost:5173" // Vite dev server
    : `${path.join(__dirname, "frontend/dist/index.html")}`; // built React app

  mainWindow.loadURL(startUrl);

  // Optional: debugging  if (isDev)
 mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle(
  "save-project",
  async (event, { projectId, folders, files, rootFolder }) => {
    const baseDir = path.join(
      app.getPath("userData"),
      "LatexProjects",
      projectId
    );
    fs.mkdirSync(baseDir, { recursive: true });

    // Build sets of valid names for quick lookup
    const validFolders = new Set(folders.map(f => f.name));
    const validFiles = new Set(files.map(f => f.name));

    // Cleanup function
    const cleanRecursive = (dir, parentId) => {
      const childFolders = folders.filter(
        (f) => f.parent?.toString() === parentId?.toString()
      );
      const childFiles = files.filter(
        (f) => f.parent?.toString() === parentId?.toString()
      );

      // List what's already on disk
      if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            // Is this folder still in DB?
            const match = childFolders.find((f) => f.name === entry.name);
            if (!match) {
              fs.rmSync(fullPath, { recursive: true, force: true });
            } else {
              cleanRecursive(fullPath, match._id); // recurse into valid folder
            }
          } else {
            // Is this file still in DB?
            const match = childFiles.find((f) => f.name === entry.name);
            if (!match) {
              fs.unlinkSync(fullPath);
            }
          }
        }
      }
    };

    // Write function (same as yours)
    const writeRecursive = (dir, parentId) => {
      const childFolders = folders.filter(
        (f) => f.parent?.toString() === parentId?.toString()
      );
      for (const folder of childFolders) {
        const folderPath = path.join(dir, folder.name);
        fs.mkdirSync(folderPath, { recursive: true });
        writeRecursive(folderPath, folder._id);
      }

      const childFiles = files.filter(
        (f) => f.parent?.toString() === parentId?.toString()
      );
      for (const file of childFiles) {
        const filePath = path.join(dir, file.name);
        const buffer = Buffer.from(file.blobId.content, "base64");

        if (/\.(png|jpg|jpeg|pdf|svg)$/i.test(file.name)) {
          fs.writeFileSync(filePath, buffer);
        } else {
          fs.writeFileSync(filePath, buffer.toString("utf8"));
        }
      }
    };

    // First clean, then rewrite
    cleanRecursive(baseDir, rootFolder);
    writeRecursive(baseDir, rootFolder);

    return baseDir;
  }
);

// Compile project locally
ipcMain.handle(
  "compile-project",
  async (event, { projectPath, mainFileName }) => {
    return new Promise((resolve, reject) => {
      const mainFilePath = path.join(projectPath, mainFileName);
      exec(`tectonic "${mainFilePath}" --outdir="${projectPath}"`, (err) => {
        if (err) return reject(err);

        const pdfPath = path.join(
          projectPath,
          mainFileName.replace(".tex", ".pdf")
        );
        if (fs.existsSync(pdfPath)) {
          const data = fs.readFileSync(pdfPath);
          resolve(data);
        } else {
          reject(new Error("PDF not generated"));
        }
      });
    });
  }
);

