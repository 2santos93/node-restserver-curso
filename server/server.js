require("./config/config");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// enable public folder
app.use(express.static(path.resolve(__dirname, "../public")));

// routes modules
app.use(require('./routes/index'));

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