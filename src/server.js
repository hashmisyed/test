import http from 'http';
import { fork } from 'child_process';

const NUM_CHILD_PROCESSES = 4;

const workers = [];
for (let i = 0; i < NUM_CHILD_PROCESSES; i++) {
    const worker = fork('./worker.js');
    workers.push(worker);
}

let i = 0;
const server = http.createServer((req, res) => {
    const worker = workers[i];
    i = (i++) % workers.length;
    worker.send({ req, res });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Parent process listening on port ${PORT}`);
});
