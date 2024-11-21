import os from 'node:os';

function getIPv4Address() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName];
        for (const interfaceDetails of networkInterface) {
            if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
              const octets = interfaceDetails.address.split('.').map(Number);
              return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
            }
        }
    }
    return null; // If no IPv4 address found
}

export class TXID {
  static readonly t0 = BigInt(Date.now() * 1000000);
  static readonly hrStart = process.hrtime.bigint();
  static readonly serverIP = getIPv4Address().toString(16).padStart(4, '0');
  static readonly port = (Number(process.env.PORT) || 3000).toString(16).padStart(2, '0'); //TODO: change port to what expressjs is listening.
  static ts = BigInt('0');
  constructor() {};
	static genTXID(): string {
		const now = TXID.t0 + process.hrtime.bigint() - TXID.hrStart;
    if (now > TXID.ts) {
      TXID.ts = now;
    } else {
      TXID.ts++;
    }

    const timeLow = (TXID.ts & BigInt('0xFFFFFFFF')).toString(16).padStart(8, '0');
    const timeMid = ((TXID.ts >> BigInt('32')) & BigInt('0xFFFF')).toString(16).padStart(4, '0');
    const timeHigh = (((TXID.ts >> BigInt('48')) & BigInt('0x0FFF')) | BigInt('0x1000')).toString(16).padStart(4, '0');

    const txid = `${timeLow}-${timeMid}-${timeHigh}-${TXID.serverIP}-${TXID.port}`;

    return txid;
	}
  static timeV1(v1: string): string {
    const timeLow = v1.slice(0, 8);
    const timeMid = v1.slice(9, 13);
    const timeHigh = v1.slice(15, 18);
    const clockSeq = v1.slice(19, 23);
		const time = ((BigInt(`0x${timeHigh}${timeMid}${timeLow}`) * BigInt('100')) + (BigInt(`0x${clockSeq}`) / BigInt('100')) - BigInt('12219292800000000000')).toString(10) + '.' + (BigInt(`0x${clockSeq}`) % BigInt('100000')).toString(10).padStart(5, '0');
    return time;
	}
}
