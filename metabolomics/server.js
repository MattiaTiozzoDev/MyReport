const express = require("express");
const path = require("path");
const getPort = require("get-port").default;

let serverInstance;
let port;

async function startAssetServer() {
  if (serverInstance) {
    return { port };
  }

  port = await getPort();

  const app = express();

  const distRoot = path.join(__dirname, "dist/my_report/browser");

  app.use("/assets", express.static(`${distRoot}/assets`));

  // CSS Angular
  app.use("/", express.static(distRoot));

  return new Promise((resolve, reject) => {
    serverInstance = app.listen(port, () => {
      console.log(`Asset server running on http://localhost:${port}`);
      resolve({ port });
    });

    // Gestisci errori del server
    serverInstance.on('error', (error) => {
      console.error('Asset server error:', error);
      reject(error);
    });
  });
}

function stopAssetServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        serverInstance = null;
        port = null;
        console.log('Asset server stopped');
        resolve();
      });

      // Forza la chiusura dopo 5 secondi se ancora aperto
      const timeout = setTimeout(() => {
        if (serverInstance) {
          serverInstance.destroy();
          serverInstance = null;
          port = null;
        }
        clearTimeout(timeout);
        resolve();
      }, 5000);
    } else {
      resolve();
    }
  });
}

module.exports = {
  startAssetServer,
  stopAssetServer,
};
