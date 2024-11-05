import express, { Request, Response, NextFunction } from 'express';
// import { DBInstance, executePathProc } from './src/services/db.ts';
// import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const callProc = async function(db: string, req: Request, res: Response) {
//     const procName = db + '.' + req.method + req.route.path.replaceAll('/', '_').replaceAll(':', '$');
//     const resp = await executePathProc(procName, req);
//     res.status(200).json(resp);
// }

// for (const proc of procs) {
//     const [db, method, ...p] = proc.split('_');
//     const path = p.join('/').replaceAll('$', ':');
//     console.log(db, method, path);
//     if (method === 'GET') {
//         app.get(path, (req: Request, res: Response) => {
//             callProc(db, req, res);
//         });
//     } else if (method === 'POST' || method === 'PST') {
//         app.post(path, (req, res) => {
//             callProc(db, req, res);
//         });
//     } else if (method === 'DELETE' || method === 'DEL') {
//         app.delete(path, (req, res) => {
//             callProc(db, req, res);
//         });
//     } else if (method === 'PUT') {
//         app.put(path, (req, res) => {
//             callProc(db, req, res);
//         });
//     } else if (method === 'PATCH' || method === 'PAT') {
//         app.patch(path, (req, res) => {
//             callProc(db, req, res);
//         });
//     } else throw new Error(`unknown method: ${method}`);
// }
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(err.message);
    next();
})

// DBInstance.InitalizeDbPool();
// DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

export class UUID {
  static startTime = BigInt(new Date().getTime() * 10000) + 0x01B21DD213814000n;//(100 nano second)s since epoch 1582-10-15
  static lastTS = 0n;
  static sequence = 0;
  static readonly mac: number = Math.random() * 0x10000000000000;// TODO: set multicast bit '1'
	static hrStart = process.hrtime.bigint();

  static genV1(): string {
		const now = UUID.startTime + process.hrtime.bigint() - UUID.hrStart;
    if (now > UUID.lastTS) {
      UUID.lastTS = now;
			UUID.sequence = 0;
    } else if (now === UUID.lastTS) {
			UUID.sequence++;
    } else { // now < UUID.lastTS. clock moved backwards. Should never happen with process.hr(). TODO: Send notification to monitoring server
			UUID.startTime = BigInt(new Date().getTime() * 10000) + 0x01B21DD213814000n;
			UUID.hrStart = process.hrtime.bigint();
			UUID.lastTS = now;
			UUID.sequence++;
    }

    const timeLow = (now & 0xFFFFFFFFn).toString(16).padStart(8, '0');
    const timeMid = ((now >> 32n) & 0xFFFFn).toString(16).padStart(4, '0');
    const timeHigh = (((now >> 48n) & 0x0FFFn) | 0x1000n).toString(16).padStart(4, '0');

    const clockSeq = Math.floor(UUID.sequence * 0x3FFF).toString(16).padStart(4, '0');

    const mac = UUID.mac.toString(16).padStart(12, '0');
    const uuid = `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${mac}`;

    return uuid;
	}
  static timeV1(v1: string): bigint {
    const timeLow = v1.slice(0, 8);
		console.log(timeLow);
    const timeMid = v1.slice(9, 13);
		console.log(timeMid);
    const timeHigh = v1.slice(15, 18);
		console.log(timeHigh);
    const clockSeq = v1.slice(19, 23);
		console.log(clockSeq);

    // const time = BigInt(`0x${timeHigh}${timeMid}${timeLow}${clockSeq}`) - 0x01B21DD213814000n;
    const time = BigInt(`0x${timeHigh}${timeMid}${timeLow}`) - 0x01B21DD213814000n;
// dfb024e8-9af4-11ef-0000-b54afe78410fa
    return time;
	}
}

console.log(UUID.timeV1('dfb024e8-9af4-11ef-0000-b54afe78410fa'));
