const mongoose = require('mongoose');


const users = new mongoose.Schema({

    username :{
        type:String
    },
    email :{
        type:String
    },
    password :{
        type:String
    },
    phoneno :{
        type:Number
    }



    

});

module.exports =mongoose.model("users",users);
