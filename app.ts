import express, { Request, Response } from 'express';

const app = express()
const port = 3000

app.use(express.json());

const fn = function(req, res) {
    res.send(req.method + req.route.path.replaceAll('/', '_').replaceAll(':', '$')) ;
}

app.get('/User', fn);
app.get('/Pet', fn);
app.get('/dashboard', fn);
app.get('/Account', fn);
app.get('/Payment', fn);
app.get('/User/:userId', fn);
app.get('/User/:userId/Pet/:petId', fn);
app.get('/dashboard2', fn);
app.get('/dashboard3', fn);
app.get('/dashboard4', fn);
app.get('/dashboard5', fn);


app.get('/', (req, res) => {
    res.send('🦄🌈✨👋🌎🌍🌏✨🌈🦄')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
