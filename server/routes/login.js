const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('../models/user');

app.post("/login", (req, res) => {

    const body = req.body;
    User.findOne({
        email: body.email
    },(err, user) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!user){
            return res.status(500).json({
                ok:false,
                message: "Correo no existe"
            });
        }
        if(!bcrypt.compareSync(body.password, user.password[0])){
            return res.status(400).json({
                ok:false,
                message: "Contraseña incorrecta"
            });
            
        }

        const token = jwt.sign({user}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});

        res.json({
            ok: true,
            user,
            token
        });

     });
    
});

module.exports = app;
