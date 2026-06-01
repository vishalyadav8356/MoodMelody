const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        select:false, // to exclude password field when fetching user data
    },
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;