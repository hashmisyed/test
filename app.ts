import express, { Request, Response } from 'express';
import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());

const fnRouter = function(req: Request, res: Response) {
    res.send(req.method + req.route.path.replaceAll('/', '_').replaceAll(':', '$')) ;
}

for (const proc of procs) {
    const index = proc.indexOf('_');
    const method = proc.slice(0, index);
    const path = proc.slice(index).replaceAll('$', ':').replaceAll('_', '/');
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
