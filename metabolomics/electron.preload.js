const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  exportPDF: (payload) => ipcRenderer.invoke("export-pdf", payload),
  openExportFolder: (payload) =>
    ipcRenderer.invoke("opend-export-folder", payload),
});
