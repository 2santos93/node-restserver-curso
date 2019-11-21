const express = require('express');
const User = require('../models/user');
const {verifyToken,verifyRoleAdmin} = require("../middlewares/authorization");
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);

    User.find({state:true}, "name email role state google img")
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if(err) res.status(400).json({
                ok:false,
                err
            })

            User.countDocuments({state:true})
                .exec((err, total) => {

                    if(err) res.status(400).json({
                        ok:false,
                        err
                    });

                    res.json({
                        ok: true,
                        users,
                        total
                    });
                });
        });


});

app.post('/usuario', [verifyToken, verifyRoleAdmin],(req, res) => {

    const body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save( (err, user) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        res.json({
            ok: true,
            user
        });

    });
});

app.put('/usuario/:id', [verifyToken, verifyRoleAdmin],(req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ["name", "email", "img", "role", "state"]);
    // const body = req.body;
    
    // body.password = bcrypt.hashSync(body.password, 10);

    User.findByIdAndUpdate(id, body, 
        {
            new:true, 
            runValidators: true,
            upsert: true,
            setDefaultsOnInsert: true,
            context: 'query'

        },(err, user) => {


            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                user
            });

    });

});

app.delete('/usuario/:id',[verifyToken, verifyRoleAdmin], (req, res) => {

    const id = req.params.id;

    User.findByIdAndUpdate(id, {state: false}, {new: true}, (err, userDeleted) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        if(!userDeleted){
            return res.status(400).json({
                ok:false,
                err: "user not found"
            });
        }

        res.json({
            ok: true,
            userDeleted
        });
    });
    // User.findByIdAndRemove(id, (err, userDeleted) => {

    //     if(err) res.status(400).json({
    //         ok:false,
    //         err
    //     })

    //     if(!userDeleted){
    //         return res.status(400).json({
    //             ok:false,
    //             err: "user not found"
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         userDeleted
    //     });

    // });

});

module.exports = app;