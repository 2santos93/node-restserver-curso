require("./config/config");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(require('./routes/index'));

// routes modules

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, (err, res) => {
    if(err) throw err;

    console.log("DB ONLINE")
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor listen to port ${process.env.PORT}`);
});