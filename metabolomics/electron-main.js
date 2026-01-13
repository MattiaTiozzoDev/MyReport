const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { startAssetServer, stopAssetServer } = require("./server");

let assetPort;
let filePaths;

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 760,
    fullscreenable: false,
    autoHideMenuBar: true,
    maxHeight: 760,
    maxWidth: 1080,
    minHeight: 760,
    minWidth: 760,
    icon: path.join(__dirname, "assets", "/img/my_report_icon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "electron.preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  // Punta alla build di Angular
  if (app.isPackaged) {
    // ✅ PRODUZIONE (app.asar)
    win.loadFile(path.join(__dirname, "dist/my_report/browser/index.html"));
    win.webContents.openDevTools();
  } else {
    // ✅ SVILUPPO
    win.loadURL("http://localhost:4200");
    win.webContents.openDevTools();
  }
}

// --- Qui inserisci l'handler IPC ---
ipcMain.handle("export-pdf", async (event, payload) => {
  const { htmlContent, fileName } = payload;

  // Inietta <base> + fallback
  const finalHtml = buildPrintableHtml(htmlContent);

  const pdfWin = new BrowserWindow({
    show: false,
    webPreferences: { sandbox: false, devTools: false },
  });

  await pdfWin.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(finalHtml)}`
  );

  // 🔒 Dialog aperto SOLO la prima volta
  if (!filePaths) {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled || !result.filePaths.length) {
      pdfWin.close();
      throw new Error("Salvataggio annullato");
    }

    filePaths = result.filePaths; // ← ora è valorizzata
  }

  const pdfPath = path.join(filePaths[0], fileName);

  const pdfData = await pdfWin.webContents.printToPDF({
    printBackground: true,
    marginsType: 2,
    pageSize: "A4",
    preferCSSPageSize: true,
  });

  fs.writeFileSync(pdfPath, pdfData);
  pdfWin.close();

  return pdfPath;
});

function buildPrintableHtml(bodyHtml) {
  const assetBaseUrl = `http://localhost:${assetPort}`;
  const distRoot = path.join(__dirname, "dist/my_report/browser");
  const styles = getAngularStyles(distRoot);
  console.log(assetBaseUrl);

  const cssLink = `${assetBaseUrl}/${styles[0]}`;
  return `
  <html>
     <head>
        <base href="${assetBaseUrl}">
        <meta charset="UTF-8">
        <link rel="stylesheet" href="${cssLink}">
        <style>
          @page {
            size: A4;
            margin: 0mm;
          }

          body {
            zoom: 1.3333333;
          }
        </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
  </html>
  `;
}

function getAngularStyles(distRoot) {
  return fs.readdirSync(distRoot).filter((f) => /^styles-.*\.css$/.test(f));
}

// Hot reload per Electron in sviluppo
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

app.whenReady().then(async () => {
  try {
    const res = await startAssetServer();
    assetPort = res.port;
    createWindow();
  } catch (err) {
    console.error("Asset server failed:", err);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  stopAssetServer();
});
