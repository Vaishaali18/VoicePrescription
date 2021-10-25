const mongoose=require("mongoose");

const bookingSchema= new mongoose.Schema({
    doctorId:{type:mongoose.Schema.Types.ObjectId , ref : 'doctor'},
    patientId:{type:mongoose.Schema.Types.ObjectId , ref : 'user'},
});

module.exports=mongoose.model("booking",bookingSchema);