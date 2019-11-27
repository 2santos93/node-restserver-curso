const express = require('express');
const fs = require('fs');
const  path = require('path');
const {verifiyTokenUrl} = require('../middlewares/authorization');

const app = express();

app.get('/image/:type/:fileName', verifiyTokenUrl, (req, res) => {

    const type = req.params.type;
    const fileName = req.params.fileName;

    const typesEnabled = ['products', 'users'];

    if(!typesEnabled.includes(type)){
        return res.status(400).json({
            ok:false,
            message: `type [${type}] is not allowed`
        });
    }

    const pathImage = path.resolve(`./uploads/${type}/${fileName}`);

    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }else{
        const pathImageEmpty = path.resolve(`./server/assets/empty_avatar.jpg`);
        res.sendFile(pathImageEmpty);
    }

});

module.exports = app;