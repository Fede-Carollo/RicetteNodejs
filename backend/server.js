const http = require('http');
const app = require('./app');
const https = require('https');
const fs = require('fs');
const host = "localhost";
const normalizePort = (val) => {
  let port = parseInt(val, 10);

  if(isNaN(port))
    return val;
  if(port>=0)
    return port;
  return false;
};

const onError = (error) => {
  if(error.syscall !== "listen")
    throw error;
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch(error.code)
  {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const port = normalizePort(process.env.PORT || "5000");
const httpsPort = normalizePort(process.env.PORT || "3000");
app.set("port", port);
const httpsServer = https.createServer({
  "key": fs.readFileSync(__dirname + "/keys/private.key"),
  "cert": fs.readFileSync(__dirname + "/keys/certificate.crt")
}, app);

httpsServer.on("error", onError);
httpsServer.listen(httpsPort,host, () => { console.log("Https server listening on port " + httpsPort)});
/*const server = http.createServer((req, res) => {
  res.writeHead(302, {'Location': `https://${host}:${httpsPort}${req.url}`});
  res.end();
});*/
const server = http.createServer(app);
server.on("error", onError);
server.listen(port, host,  () => { console.log("Redirect server listening on port " + port)});
