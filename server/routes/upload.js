const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/user');
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');

const app = express();

app.use( fileUpload({useTempFiles : true}) );

app.put('/upload/:type/:id', (req, res) => {

    const type = req.params.type;
    const id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok:false,
            message: "doesnt exist files"
        })
    }

    //validate type
    const typesEnabled = ['products', 'users'];

    if(!typesEnabled.includes(type)){
        return res.status(400).json({
            ok:false,
            message: `type [.${type}] it's not allowed `
        });
    }

    //get file
    let file = req.files.file;

    // get extension and validate if is allowed
    const nameFileSplited = file.name.split('.');

    const extension = (nameFileSplited[nameFileSplited.length-1]) ? nameFileSplited[nameFileSplited.length-1] : '';

    const extensionsEnabled = ['jpg', 'jpeg', 'gif', 'png'];

    if(!extensionsEnabled.includes(extension)){
        return res.status(400).json({
            ok:false,
            message: `extension [.${extension}] it's not allowed `
        });
    }

    const fileName = `${id}${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        (type === 'users') ? updateUserImage(id, fileName, res) : updateProductImage(id, fileName, res);

    });

});

function updateUserImage(id, fileName, res){

    User.findByIdAndUpdate({_id: id}, {img: fileName}, (err, userEdited) => {

        if(err){
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!userEdited){
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok:false,
                message: "user doesnt exists"
            });
        }

        deleteFile(userEdited.img, 'users');

        res.json({
            ok:true,
            userEdited
        });

    });

}

function updateProductImage(id, fileName, res){
    
    Product.findByIdAndUpdate({_id: id}, {img: fileName}, (err, productEdited) => {

        if(err){
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productEdited){
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok:false,
                message: "product doesnt exists"
            });
        }

        deleteFile(productEdited.img, 'products');

        res.json({
            ok:true,
            productEdited
        });

    });

}

function deleteFile(fileName, type){
    const pathFile = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    if(fs.existsSync(pathFile)){
        fs.unlinkSync(pathFile);
    }
}

module.exports = app;