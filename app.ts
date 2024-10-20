import express, { Request, Response } from 'express';
import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const fnRouter = function(req: Request, res: Response) {
    const proc = req.method + req.route.path.replaceAll('/', '_').replaceAll(':', '$');
    res.send(proc);
}

for (const proc of procs) {
    const [method, ...p] = proc.split('_');
    const path = p.join('/').replaceAll('$', ':');
    console.log(method, path);
    if (method === 'GET') {
        app.get(path, fnRouter);
    } else if (method === 'POST') {
        app.post(path, fnRouter);
    } else if (method === 'DELETE') {
        app.delete(path, fnRouter);
    } else if (method === 'PUT') {
        app.put(path, fnRouter);
    } else if (method === 'PATCH') {
        app.patch(path, fnRouter);
    } else throw new Error(`unknown method: ${method}`);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
