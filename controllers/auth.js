import User from "../models/user.js";
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const signup = (req, res) => {
   const errors = validationResult(req)
   console.log(errors)
   if(!errors.isEmpty()){
      return res.status(422).json({
        error: errors.array()[0].msg
      })
   }

  const user = new User(req.body);
  user.save( (err, user) => {
    if(err){
        return res.status(400).json({
          err: "Not able to save user in DataBase"
        });
        
    }
    res.json({
      name : user.name,
      email: user.email,
      id: user._id
    });
  })
};  

export const signin = (req, res) => {
  const errors = validationResult(req);
  console.log("HELLO FROM BACKEND")
  const {email, password} = req.body;
  console.log(req.body)
  

  if(!errors.isEmpty()){
    return res.status(422).json({
      error: errors.array()[0].msg
    })
 }

 User.findOne({email}, (err, user) => {
   if(err || !user) {
    return res.status(400).json({
      error: "user email doesn't exists"
     })
   }

   if(!user.authenticate(password)){
     res.status(401).json({
      error: "email and password do not match"
     })
   }
    // create token
   const token = jwt.sign({ _id: user._id}, process.env.SECRET)
   // put token in cookie
   res.cookie("token", token, {expire: new Date() + 9999});

   // send response to frontend
   const {_id, name, email, role} = user;
   return res.json({token, user: {_id, name, email, role}})
   
 }) 
};

export const validateJWT = async (req,res) => {
  const token = req.body
  console.log(token.token)
  try {

  const ans = await jwt.verify(token.token, process.env.SECRET)
  res.status(200).send("OK")
  } catch (e){
    res.status(400).send("Invalid")
  }
}


export const signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout Successfully"
  });
};
