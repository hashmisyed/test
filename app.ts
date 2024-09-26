const arr = new Array(2**20).fill(0).map((_, i) => 'test' + i);
console.log(arr.length.toLocaleString());
const startTime = process.hrtime();
arr[2000000000] = "test";
const used = process.memoryUsage();
console.log(`Memory usage:`);
console.log(`Heap Total: ${used.heapTotal / 1024 / 1024} MB`);
console.log(`Heap Used: ${used.heapUsed / 1024 / 1024} MB`);
console.log(arr[2000000000]);
console.log(arr[2000000001]);
const endTime  = process.hrtime(startTime);
console.log(`Operation took: ${endTime[1]} microseconds`);
