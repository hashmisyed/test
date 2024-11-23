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

const allEnvVars = {};
for (const key in process.env) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    allEnvVars[key] = process.env[key] ?? '';
  }
}

console.log(allEnvVars);

// DBInstance.InitalizeDbPool();
// DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});