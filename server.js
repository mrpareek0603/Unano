const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
app.use(express.json());
const PORT = 5000;
app.use(cors());

mongoose.connect("mongodb+srv://admin123:admin123@cluster0.qwfwj.mongodb.net/url-shortener?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser:true },()=>{
    console.log("Database connected");
});

// signup functionality
app.post('/user/new',(req,res)=>{
    const {name,email,password} = {...req.body};// destructuring the body object

    User.find({email})
    // array of users with the given email
    .then(user=>{
        if(user.length !=0){
            res.json({"msg":"Email already in use",isSuccessfull:false});
        }
        else{
             const newUser = User({name,email,password});

             bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                throw err;
            }
            else{
                newUser.password = hash;
                newUser.save()
                .then(user=>res.status(200).json({"msg":`New user with id:-${user._id} is made`,isSuccessfull:true}))
                .catch(err=>console.log(err))
                }
            });
        }
    }).catch(err=>{
        console.log('error while finding the email in db');
    })
});



// login functionality
app.post('/user/login', (req,res)=>{
    const {email,password} = {...req.body};

    User.find({email}).then(user=>{
            if(user.length == 0){
                res.json({"msg":"No email id exists",id:null});
            }
            else{
                // email exists, now check for password
                const dbPass = user[0].password;
                bcrypt.compare(password,dbPass,function(err,isMatch){
                    if(err){
                        throw err;
                    }

                    if(isMatch){
                        res.json({"msg":"login successfull",id:user[0]._id});
                    }
                    else{
                        res.json({"msg":"invalid credentials",id:null});
                    }
                });
            }
        });
});

// dashbord

app.post('/dashboard', (req,res) =>{
    // const {lin}
})


app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
});