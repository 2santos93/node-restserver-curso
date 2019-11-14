require("./config/config");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/usuario', (req, res) => {
    res.json("get usuario");
});

app.post('/usuario', (req, res) => {

    const body = req.body;

    res.json(body);
});

app.put('/usuario/:id', (req, res) => {
    res.json("get usuario");
});

app.delete('/usuario/:id', (req, res) => {
    res.json("get usuario");
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor listen to port ${process.env.PORT}`);
});