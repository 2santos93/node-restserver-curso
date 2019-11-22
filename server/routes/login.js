const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

        const token = generateToken(user);

        res.json({
            ok: true,
            user,
            token
        });

     });
    
});

app.post("/google", async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).catch((err) => {
        return res.status(403).json({
            ok:false,
            err
        })
    });

    User.find({email:googleUser.email}, (err, userDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(userDB.lenght > 0){
            if(!userDB.google){
                return res.status(400).json({
                    ok: false,
                    message: "Use normal auth"
                });
            }

            const token = generateToken(userDB);

            res.json({
                ok:true,
                token
            });

        }else{

            let userModel = new User({
                name: googleUser.name,
                google: true,
                email: googleUser.email,
                img: googleUser.img
            });

            userModel.save( (err) =>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                let token = generateToken()

                res.json({
                    ok:true,
                    token
                })
            });

        }
    });

});

// google config 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
// generate token server
  function generateToken(user) {
    return jwt.sign({user}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});
  }

module.exports = app;
