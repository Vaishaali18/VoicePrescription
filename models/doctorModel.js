const mongoose=require("mongoose");

const doctorSchema= new mongoose.Schema({
    firstname:{type:String,required:true, unique:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true},
    specialization:{type:String,required:true},
    timing:{type:String,required:true},
});

module.exports=mongoose.model("doctor",doctorSchema);