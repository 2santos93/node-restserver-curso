const express = require('express');
const app = express();
const {verifyToken, verifyRoleAdmin} = require("../middlewares/authorization");

const Category = require("../models/category");

app.get("/category", verifyToken, (req, res) => {
    
     Category.find()
            .sort('description')
            .populate("user", "name email")
            .exec((err, categories) => {

        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categories
        });

    });

});

app.get("/category/:id", verifyToken,  (req, res) => {

    const id = req.params.id;

    Category.findById(id, (err, category) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!category || category === null || category === undefined){

            return res.status(400).json({
                ok:false,
                message: "category does not exist"
            });

        }

        res.json({
            ok:true,
            category
        });

    });

});

app.delete("/category/:id", [verifyToken, verifyRoleAdmin], (req, res) => {

    const id = req.params.id;

    Category.findOneAndDelete({'_id': id}, (err, categoryDeleted) => {

        if(err){
            res.status(400).json({
                ok:false,
                err
            });
        }

        if(!categoryEdited){
            return res.status(400).json({
                ok:false,
                message: "error deleted category"
            });
        }

        res.json({
            ok: true,
            categoryDeleted
        });

    });

});

app.post("/category", verifyToken, (req, res) => {

    const body = req.body;
    let categoryModel = new Category();

    categoryModel.description = body.description;
    categoryModel.user = req.user._id;
    categoryModel.save((err, categorySaved) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categorySaved){
            return res.status(400).json({
                ok:false,
                message: "doesnt create category"
            });
        }

        res.json({
            ok:true,
            categorySaved
        });

    });

});
 
app.put("/category/:id", verifyToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Category.findByIdAndUpdate({_id:id}, {description: body.description}, {new:true}, (err, categoryEdited) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!categoryEdited){
            return res.status(400).json({
                ok:false,
                message: "error edited category"
            });
        }

        res.json({
            ok:true,
            categoryEdited
        });
    })

});

module.exports = app;