export class UUID {
  static startTime = BigInt(new Date().getTime() * 1000000) + 12219292800000000000n;//nano seconds since greg 1582-10-15 to epoch
  static lastTS = 0n;
  static sequence = 0;
  static readonly mac: number = Math.floor(Math.random() * 0x1000000000000);// TODO: set multicast bit '1'
	static hrStart = process.hrtime.bigint();

  static genV1(): string {
		const now = UUID.startTime + process.hrtime.bigint() - UUID.hrStart;
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

		const ns = Number(now % 100n) + UUID.sequence;
		const ts: bigint = now / 100n;
    const timeLow = (ts & 0xFFFFFFFFn).toString(16).padStart(8, '0');
    const timeMid = ((ts >> 32n) & 0xFFFFn).toString(16).padStart(4, '0');
    const timeHigh = (((ts >> 48n) & 0x0FFFn) | 0x1000n).toString(16).padStart(4, '0');

    const clockSeq = (ns).toString(16).padStart(4, '0');
    const macx = UUID.mac.toString(16).padStart(12, '0');
    const uuid = `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${macx}`;

    return uuid;
	}
  static timeV1(v1: string): bigint {
    const timeLow = v1.slice(0, 8);
    const timeMid = v1.slice(9, 13);
    const timeHigh = v1.slice(15, 18);
    const clockSeq = v1.slice(19, 23);
		const time = (BigInt(`0x${timeHigh}${timeMid}${timeLow}`) *  100n) + BigInt(`0x${clockSeq}`) - 12219292800000000000n
    return time;
	}
}
