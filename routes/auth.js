import express from 'express';
import { signout, signup, signin, validateJWT } from "../controllers/auth.js"
import { check } from 'express-validator';
const router = express.Router();

router.post("/signup",[
    check("name", "name should be min of 5 characters").isLength({ min : 5}),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 3 char").isLength({ min : 3}),
], signup);

router.post("/signin",[
    
   check("email", "email is required").isEmail(),
   check("password", "password field is required").isLength({ min : 3}),
], 
signin
);

router.post("/validateJWT", validateJWT)

router.get("/signout", signout);


export default router;
