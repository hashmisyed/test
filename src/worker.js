import express from 'express';
const app = express();

app.get('/process-data', (req, res) => {
    res.send('Request processed by worker using Express!');
});

process.on('message', (message) => {
    const { req, res } = message;
    app(req, res);
});

const PORT = process.env.PORT || 0;
app.listen(PORT, () => {
    console.log(`Worker Express server started`);
});
