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

  serverInstance = app.listen(port, () => {
    console.log(`Asset server running on http://localhost:${port}`);
  });

  return { port };
}

function stopAssetServer() {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
}

module.exports = {
  startAssetServer,
  stopAssetServer,
};
