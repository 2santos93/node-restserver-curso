const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require("../models/category");
const User = require("../models/user");

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    priceUnitary:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    status:{
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: Category
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: User
    },
    img:{
        type: String,
        required: false
    }

});

module.exports = mongoose.model("Product", productSchema);