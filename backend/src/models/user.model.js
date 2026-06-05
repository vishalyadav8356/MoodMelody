const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        trim:true,
        minlength:[3,'Username must be at least 3 characters'],
        maxlength:[30,'Username cannot exceed 30 characters'],
        unique:true
    },

    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        lowercase:true,
        unique:true,
        match:[
            /^\S+@\S+\.\S+$/,
            'Please enter a valid email'
        ]
    },

    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least 6 characters'],
        select:false
    }
},{
    timestamps:true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;