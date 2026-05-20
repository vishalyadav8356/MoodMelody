const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Username is required'],
        unique:[true, 'Username is already taken'],
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:[true, 'Email is already registered'],
    },
    password:{
        type:String,
        required:[true, 'Password is required'],  
    },
})

const userModel = mongoose.model('User', userShema);

module.exports = userModel;