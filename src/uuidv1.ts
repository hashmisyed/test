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

    const uuid = `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${UUID.mac.toString(16).padStart(12, '0')}`;

    return uuid;
	}
}

