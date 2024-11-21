import express, { Request, Response, NextFunction } from 'express';
// import express from 'express';
// import { DBInstance, executePathProc } from './src/services/db.ts';
// import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
// app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    next();
})

// DBInstance.InitalizeDbPool();
// DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// // Get all the properties (methods) on the console object
// const consoleMethods = Object.getOwnPropertyNames(console);

// // Filter to get only methods (properties that are functions)
// const consoleFunctions = consoleMethods.filter(method => typeof console[method] === 'function');

// console.log(consoleFunctions);
import net from 'net';

// Create a server to listen for incoming connections on a named pipe
const server = net.createServer((socket) => {
  console.log('Client connected');
  
  socket.on('data', (data) => {
    console.log(`Received: ${data.toString()}`);
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// Windows named pipe uses '\\.\pipe\my-pipe' format
server.listen('\\\\.\\pipe\\node-app-pipe', () => {
  console.log('Server listening on \\\\.\\pipe\\node-app-pipe');
});