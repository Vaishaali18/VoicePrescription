const router = require("express").Router();
const User=require("../models/doctorModel");
const bycrpt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth=require("../middleware/auth");
const doctor = require('../models/doctorModel');
const book = require('../models/bookingModel');
const user1=require("../models/userModel");

router.post("/login",async function(req,res){
    const {email,password}=req.body;
    
    
    if(!email || !password){
        return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    const user=await doctor.findOne({email:email});
    if(!user){
        return res.status(400).json({ msg: "No account with this email has been registered" });
    }
    
    const token=jwt.sign({id:user._id},process.env.SECRET);
    res.json({token,user:{id:user._id}});
});

router.post("/add", async function (req, res) {
    try{
        let { firstname,lastname,email,specialization,timing} = req.body;
        
    /*    if (!firsname || !lastname || !email  || !timing || !specialization) {
            return res.status(400).json({ msg: "Not all fields have been entered" });
        }
        
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({ msg: "An account with this email already exists" });
        }*/

        const newUser=new User({firstname,lastname,email,specialization,timing});
        
        const savedUser=await newUser.save();
        res.json(savedUser);
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.post("/tokenIsValid",async function(req,res){
    try{
        const token=req.header("x-auth-token");
        if(!token){
           return res.json("false");
        }
        const verified=jwt.verify(token,process.env.SECRET);
        if(!verified){
           return res.json("false");
        }
        const user=await doctor.findById(verified.id);
        if(!user){
           return res.json("false");
        }
        return res.json("true");
    }catch(err){
        return res.status(500).json({msg:err.message});
    }
});

router.get("/profile",auth,async(req,res)=>{
    const user=await doctor.findById(req.user);
    const name = user.firstname + " " + user.lastname
    res.json({
        name:name,
        email:user.email
        
    });
});

router.get("/info",async(req,res)=>{
    let id = req.query.doctorId;
    const doc=await doctor.findById(id);
    res.json({
        id:doc._id,
        email:doc.email,
        firstname:doc.firstname,
        lastname:doc.lastname
    });
});

router.get("/view",async(req,res)=>{
    doctor.find({}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});
router.get("/",async(req,res)=>{
    doctor.find({}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get("/viewCardio",async(req,res)=>{
    doctor.find({specialization :"Cardiologist"}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get("/viewPedi",async(req,res)=>{
    doctor.find({specialization :"Pediatrician"}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get("/viewGyno",async(req,res)=>{
    doctor.find({specialization :"Gynecologist"}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get("/viewNeuro",async(req,res)=>{
    doctor.find({specialization :"Neurologist"}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get("/viewGen",async(req,res)=>{
    doctor.find({specialization :"General"}).then((doctors) => {
        res.send(doctors);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.delete("/delete", async (req, res) =>{

   let id = req.body.id;
   doctor.findByIdAndDelete({_id:id}, (err) => {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted");      
    }
})
});

router.delete("/deletebooking", async (req, res) =>{
    console.log("hello")
    let id = req.body.bookingid;
    console.log(id)
    book.findByIdAndDelete({_id:id}, (err) => {
     if (err){
         console.log(err)
     }
     else{
         console.log("Book Deleted");      
     }
 })
 });

router.post("/booking", async function (req, res) {
    try{
        let { doctorId,patientId } = req.body;
        const newBook=new book({doctorId,patientId});
        
        const savedBook=await newBook.save();
        res.json(savedBook);
        
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get("/selectPatients",async(req,res)=>{
    let doctorId = req.query.doctorId;
  /*  book.find({doctorId:doctorId}).then((booked) => {
        console.log(booked)
        booked.aggregate([{
            $lookup: {
                    from: "users",
                    localField: "patientId",
                    foreignField: "_id",
                    as: "details"
                }
        }])
        console.log(booked)
    }).catch((error) => {
        res.status(500).send(error);
    });
 /*   
    console.log(doctorId)
    var list = [];
    book.find({doctorId:doctorId}).then((booked) => {
        var i;
        for (i = 0; i < booked.length; i++){
            var temp = booked[i]["patientId"];
            var booking = "{'a':"+temp+"}"
            console.log(booking)
            list.push(json)
        }
        console.log(list)
    }).catch((error) => {
        res.status(500).send(error);
    });
    console.log(typeof (list))
    var result = []
    user1.find({}).then((patients) => {
     //   console.log(patients);
        for(var i in patients){
            console.log("j")
            console.log(typeof (patients[i]._id))
            if(list.includes(patients[i]._id))
            {
               console.log("k")
               result.push(patients[i])
            }
        }
        console.log(result)
    }).catch((error) => {
        res.status(500).send(error);
    })

    const users = await book.aggregate([
        {
            $match: {
              doctorId:{doctorId}
            }
          },
        {
          $lookup: {
            from: 'user',    
            localField: 'patientId',
            foreignField: '_id',
            as: 'info'        
          }
        }
      ]);
      console.log(users)*/
      book.find({doctorId:doctorId}).populate({path:'patientId'}).then((result) => {
          res.send(result)
      });
});

router.get("/count",async(req,res)=>{
    const count = await doctor.count();
    res.json({
        count:count
    })
});

router.get("/bookcount",async(req,res)=>{
    const count = await book.count();
    res.json({
        count:count
    })
});
module.exports = router;
