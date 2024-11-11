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

export class UUID {
  static startTime = BigInt(new Date().getTime() * 1000000) + BigInt('12219292800000000000');//nano seconds since greg 1582-10-15 to epoch
  static lastTS = BigInt('0');
  static sequence = 0;
	static hrStart = process.hrtime.bigint();
  static IPv4 = getIPv4Address();
  static port = Number(process.env.PORT) || 3000;
  static genV1(): string {
		const now = UUID.startTime + process.hrtime.bigint() - UUID.hrStart;
    if (now > UUID.lastTS) {
      UUID.lastTS = now;
			UUID.sequence = 0;
    } else if (now === UUID.lastTS) {
			UUID.sequence++;
    } else { // now < UUID.lastTS. clock moved backwards. Should never happen with process.hr(). TODO: Send notification to monitoring server
			UUID.startTime = BigInt(new Date().getTime() * 1000000) + BigInt('12219292800000000000');
			UUID.hrStart = process.hrtime.bigint();
			UUID.lastTS = now;
			UUID.sequence++;
      console.log('clock moved backwards');
    }
		const ns = (Number(now % BigInt('100')) * 1000000000 + UUID.sequence * 100) / 100;
		const ts: bigint = now / BigInt('100');
    const timeLow = (ts & BigInt('0xFFFFFFFF')).toString(16).padStart(8, '0');
    const timeMid = ((ts >> BigInt('32')) & BigInt('0xFFFF')).toString(16).padStart(4, '0');
    const timeHigh = (((ts >> BigInt('48')) & BigInt('0x0FFF')) | BigInt('0x1000')).toString(16).padStart(4, '0');

    const clockSeq = (ns).toString(16).padStart(4, '0');
    const IPv4 = UUID.IPv4.toString(16).padStart(4, '0');
    const port = UUID.port.toString(16).padStart(2, '0');
    const uuid = `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${IPv4}${port}`;

    return uuid;
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
