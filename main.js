const { app, BrowserWindow, ipcMain, dialog  } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const tectonicPath = path.join(process.resourcesPath, "tectonic.exe");
// const tectonicPath = path.join(__dirname, "tectonic.exe");

const isDev = false; // change to false in prod
let mainWindow;

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");
log.info("App version:", app.getVersion());
log.info("isPackaged:", app.isPackaged);

function createWindow() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadFile("splash.html");

  mainWindow = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, "logo.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "frontend/dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    splash.close();
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.setMenu(null);
  
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      (input.key === "I" && input.control && input.shift) ||
      input.key === "F12"
    ) {
      event.preventDefault();
    }
  });
}

app.on("ready", () => {
  createWindow();

  // Check for updates after app loads (only in production)
  if (!isDev) {
    setTimeout(() => {
      log.info("Checking for updates...");
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
  }
});

// ========== AUTO-UPDATER EVENTS ==========

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for updates...");
});

autoUpdater.on("update-not-available", (info) => {
  log.info("Update not available. Current version is up to date.");
});

autoUpdater.on("error", (err) => {
  log.error("Update error:", err);
  log.error("Error stack:", err.stack);
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available:", info.version);
  
  dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "Update Available",
    message: `A new version ${info.version} is available!`,
    detail: `Current version: ${app.getVersion()}\n\nThe update will be downloaded in the background.`,
    buttons: ["OK"]
  });
});

autoUpdater.on("download-progress", (progressObj) => {
  const percent = Math.round(progressObj.percent);
  const transferredMB = (progressObj.transferred / 1024 / 1024).toFixed(1);
  const totalMB = (progressObj.total / 1024 / 1024).toFixed(1);
  const speedMBps = (progressObj.bytesPerSecond / 1024 / 1024).toFixed(2);
  
  log.info(`Download progress: ${percent}% (${transferredMB}MB / ${totalMB}MB) @ ${speedMBps}MB/s`);
  
  // Update window title to show progress
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setTitle(`LatexWriter - Downloading Update ${percent}%`);
  }
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info.version);
  
  // Reset window title
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setTitle("LatexWriter");
  }
  
  const choice = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    buttons: ["Restart Now", "Later"],
    defaultId: 0,
    cancelId: 1,
    title: "Update Ready",
    message: `Version ${info.version} has been downloaded and is ready to install!`,
    detail: "The application will restart to complete the installation."
  });

  if (choice === 0) {
    setImmediate(() => autoUpdater.quitAndInstall());
  }
});

// ========== APP LIFECYCLE ==========

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
    const validFolders = new Set(folders.map((f) => f.name));
    const validFiles = new Set(files.map((f) => f.name));

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
      exec(`"${tectonicPath}" "${mainFilePath}" --outdir="${projectPath}"`, (err) => {
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
