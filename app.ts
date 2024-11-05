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
  static startTime = BigInt(new Date().getTime() * 1000000) + 12219292800000000000n;//nano seconds since greg 1582-10-15 to epoch
  static lastTS = 0n;
  static sequence = 0;
  static readonly mac: number = Math.floor(Math.random() * 0x1000000000000);// TODO: set multicast bit '1'
	static hrStart = process.hrtime.bigint();

  static genV1(): string {
		console.log('new Date().getTime()', new Date().getTime());
		console.log('startTime', UUID.startTime);
		const now = UUID.startTime + process.hrtime.bigint() - UUID.hrStart;
		console.log('now', now);
    if (now > UUID.lastTS) {
      UUID.lastTS = now;
			UUID.sequence = 0;
    } else if (now === UUID.lastTS) {
			UUID.sequence++;
    } else { // now < UUID.lastTS. clock moved backwards. Should never happen with process.hr(). TODO: Send notification to monitoring server
			UUID.startTime = BigInt(new Date().getTime() * 1000000) + 12219292800000000000n;
			UUID.hrStart = process.hrtime.bigint();
			UUID.lastTS = now;
			UUID.sequence++;
    }
		console.log('now', now);

		const ns = Number(now % 100n) + UUID.sequence;
		console.log('ns', ns);
		const ts: bigint = now / 100n;
		console.log('ts', ts);
    const timeLow = (ts & 0xFFFFFFFFn).toString(16).padStart(8, '0');
    const timeMid = ((ts >> 32n) & 0xFFFFn).toString(16).padStart(4, '0');
    const timeHigh = (((ts >> 48n) & 0x0FFFn) | 0x1000n).toString(16).padStart(4, '0');

    const clockSeq = (ns).toString(16).padStart(4, '0');
		console.log('clockSeq', clockSeq);
		console.log('UUID.mac', UUID.mac);
    const macx = UUID.mac.toString(16).padStart(12, '0');
    const uuid = `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${macx}`;

    return uuid;
	}
  static timeV1(v1: string): bigint {
    const timeLow = v1.slice(0, 8);
		// console.log(timeLow);
    const timeMid = v1.slice(9, 13);
		// console.log(timeMid);
    const timeHigh = v1.slice(15, 18);
		// console.log(timeHigh);
    const clockSeq = v1.slice(19, 23);
		// console.log(clockSeq);

    // const time = BigInt(`0x${timeHigh}${timeMid}${timeLow}${clockSeq}`) - 0x01B21DD213814000n;
    const t = BigInt(`0x${timeHigh}${timeMid}${timeLow}`);
		console.log('t', t);
		const tseq = BigInt(`0x${clockSeq}`);
		console.log('tseq', tseq);
    const tss = (t *  100n) + tseq;
		console.log('tss', tss);
		const time = tss - 12219292800000000000n
// dfb024e8-9af4-11ef-0000-b54afe78410fa
		console.log('time', time);
    return time;
	}
}
const uuid = UUID.genV1();
console.log('uuid', uuid);
console.log('v1', UUID.timeV1(uuid));
