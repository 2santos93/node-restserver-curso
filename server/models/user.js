const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

const roles = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: '{VALUE} no es un rol valido'
}

let userSchema = new Schema({
    name:{
        type: [String, "name will be string"],
        required: true
    },
    email:{
        required: true,
        unique: true,
        type: [String, "email will be string"]
    },
    password:{
        type: [String, "password will be string"],
        required: true,
        // select: false
    },
    img:{
        type: [String, "img will be string"],
        required: false
    },
    role:{
        type: [String, "img will be string"],
        default: 'USER_ROLE',
        enum: roles
    },
    state:{
        type: [Boolean, "state will be Boolean"],
        default: true
    },
    google:{
        type: [Boolean, "google will be Boolean"],
        default: false
    },
});

userSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model("User", userSchema);