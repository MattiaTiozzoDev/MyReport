const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { startAssetServer, stopAssetServer } = require("./server");

let assetPort;
let filePaths;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  // Punta alla build di Angular
  if (app.isPackaged) {
    // ✅ PRODUZIONE (app.asar)
    mainWindow.loadFile(path.join(__dirname, "dist/my_report/browser/index.html"));
    //mainWindow.webContents.openDevTools();
  } else {
    // ✅ SVILUPPO
    mainWindow.loadURL("http://localhost:4200");
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

ipcMain.handle("open-export-folder", async (event, payload) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (result.canceled || !result.filePaths.length) {
    throw new Error("Salvataggio annullato");
  }

  filePaths = result.filePaths;
  return filePaths;
});

// Handler per esportare PDF
ipcMain.handle("export-pdf", async (event, payload) => {
  const { htmlContent, fileName } = payload;

  // Inietta <base> + fallback
  const finalHtml = buildPrintableHtml(htmlContent);

  const pdfWin = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: true,
      devTools: false,
      contextIsolation: true,
    },
  });

  try {
    await pdfWin.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(finalHtml)}`,
    );

    // Attendi che la pagina sia caricata
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!filePaths || !filePaths[0]) {
      throw new Error("Cartella di export non selezionata");
    }

    const pdfPath = path.join(filePaths[0], fileName);

    const pdfData = await pdfWin.webContents.printToPDF({
      printBackground: true,
      marginsType: 2,
      pageSize: "A4",
      preferCSSPageSize: true,
    });

    fs.writeFileSync(pdfPath, pdfData);
    return pdfPath;
  } finally {
    // Assicurati che la finestra PDF sia chiusa
    if (!pdfWin.isDestroyed()) {
      pdfWin.close();
    }
  }
});

function buildPrintableHtml(bodyHtml) {
  const assetBaseUrl = `http://localhost:${assetPort}`;
  const distRoot = path.join(__dirname, "dist/my_report/browser");
  const styles = getAngularStyles(distRoot);

  if (styles.length === 0) {
    console.warn("Attenzione: Nessun file CSS trovato in dist/my_report/browser");
  }

  const cssLink = styles.length > 0 ? `${assetBaseUrl}/${styles[0]}` : '';

  // Carica i font come data URI per includerli nel PDF
  const fontRegular = loadFontAsDataUri(path.join(distRoot, "assets/fonts/montserrat/Montserrat-Regular.woff2"));
  const fontBold = loadFontAsDataUri(path.join(distRoot, "assets/fonts/montserrat/Montserrat-Bold.woff2"));
  const fontMedium = loadFontAsDataUri(path.join(distRoot, "assets/fonts/montserrat/Montserrat-Medium.woff2"));

  return `
  <!DOCTYPE html>
  <html>
     <head>
        <base href="${assetBaseUrl}">
        <meta charset="UTF-8">
        ${cssLink ? `<link rel="stylesheet" href="${cssLink}">` : ''}
        <style>
          @page {
            size: A4;
            margin: 0mm;
          }

          body {
            zoom: 1.333; /* 4/3 per scalare il PDF all'altezza corretta */
            margin: 0;
            padding: 0;
          }

          /* Font Montserrat Regular */
          @font-face {
            font-family: 'Montserrat';
            src: url('data:application/font-woff2;charset=utf-8;base64,${fontRegular}') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }

          /* Font Montserrat Medium */
          @font-face {
            font-family: 'Montserrat';
            src: url('data:application/font-woff2;charset=utf-8;base64,${fontMedium}') format('woff2');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }

          /* Font Montserrat Bold */
          @font-face {
            font-family: 'Montserrat';
            src: url('data:application/font-woff2;charset=utf-8;base64,${fontBold}') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }

          /* Font di fallback */
          html, body {
            font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          }

          * {
            font-family: inherit;
          }
        </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
  </html>
  `;
}

/**
 * Carica un font file e lo converte in base64
 */
function loadFontAsDataUri(fontPath) {
  try {
    if (!fs.existsSync(fontPath)) {
      console.warn(`Font non trovato: ${fontPath}`);
      return '';
    }
    const fontBuffer = fs.readFileSync(fontPath);
    return fontBuffer.toString('base64');
  } catch (error) {
    console.error(`Errore nel caricamento del font ${fontPath}:`, error);
    return '';
  }
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

// Pulisci risorse prima di uscire
app.on("before-quit", async () => {
  await stopAssetServer();

  // Chiudi tutte le finestre aperte
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(win => {
    if (!win.isDestroyed()) {
      win.close();
    }
  });
});

// Gestisci errori e cleanup in caso di crash
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  stopAssetServer();
  process.exit(1);
});
