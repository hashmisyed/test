import express, { Request, Response, NextFunction } from 'express';
import { DBInstance, executePathProc } from './src/services/db.ts';
import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const callProc = async function(db: string, req: Request, res: Response) {
    const procName = db + '.' + req.method + req.route.path.replaceAll('/', '_').replaceAll(':', '$');
    const resp = await executePathProc(procName, req);
    res.status(200).json(resp);
}

for (const proc of procs) {
    const [db, method, ...p] = proc.split('_');
    const path = p.join('/').replaceAll('$', ':');
    console.log(db, method, path);
    if (method === 'GET') {
        app.get(path, (req: Request, res: Response) => {
            callProc(db, req, res);
        });
    } else if (method === 'POST' || method === 'PST') {
        app.post(path, (req, res) => {
            callProc(db, req, res);
        });
    } else if (method === 'DELETE' || method === 'DEL') {
        app.delete(path, (req, res) => {
            callProc(db, req, res);
        });
    } else if (method === 'PUT') {
        app.put(path, (req, res) => {
            callProc(db, req, res);
        });
    } else if (method === 'PATCH' || method === 'PAT') {
        app.patch(path, (req, res) => {
            callProc(db, req, res);
        });
    } else throw new Error(`unknown method: ${method}`);
}
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(err.message);
    next();
})

DBInstance.InitalizeDbPool();
DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

