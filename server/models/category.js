const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/user");

const categorySchema = new Schema({
    description: {
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref: User
    }
});

module.exports = mongoose.model("Category", categorySchema);