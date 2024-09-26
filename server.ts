import process from "node:process";
// prettier ignore
import express, { Express, Request, Response, Application, NextFunction } from "express";
import { DBInstance } from "./src/services/db.ts";
import * as routes from "./src/router.ts";
DBInstance.InitalizeDbPool();

// import WebSocket from "ws";
// const ws = new WebSocket("ws://example.com");

// import { fork } from "child_process";
// const child = fork("path/to/your/script.js");

const app: Application = express();
app.use(express.json());
// prettier ignore
app.use(express.urlencoded({ extended: true }));

routes.useRoutes(app);

function exitHandler(signal) {
  console.log(`Received ${signal}. Exiting...`);
  DBInstance.DestroyPool();
  // closeWSConnection();
  // child.kill('SIGINT');
}
process.on("SIGINT",  exitHandler);
process.on("SIGTERM", exitHandler);
process.on("SIGKILL", exitHandler);
process.on("EXIT", exitHandler);
process.on('uncaughtException', ()=>{})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
console.log(server);
