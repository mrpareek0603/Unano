const express = require('express');
const mongoose = require('mongoose');
const app = express ();
const User2 = require('./Models/User2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json());

const PORT=5000;

mongoose.connect("mongodb+srv://admin123:admin123@cluster0.qwfwj.mongodb.net/url-shortener2?retryWrites=true&w=majority", {
    useUnifiedTopology: true, useNewUrlParser:true
},()=>{
    console.log("database 2 connected");
});


app.post('/user/new',(req,res)=>{
    const {name,email,password} = {...req.body};

    User2.find({email})
    .then(user=>{
        if(user.length!=0){
            res.json({"msg":"Email already in use"});
        }
        else{
            const newUser2 = User2({name,email,password});

            bcrypt.hash(password, saltRounds,function(err,hash) {
                if(err){
                    throw err;
                }
                else{
                    newUser2.password = hash;
                    newUser2.save()
                    .then(user=>res.status(200).json({"msg":`User with id ${user.__id} is here`}))
                    .catch(err=>console.log(err))
                }
            });
        }
    }).catch(err=>{
        console.log('error while finding email in db2');
    })
});


app.listen(PORT, ()=>{
    console.log(`Server is on ${PORT} and working fine`);
});