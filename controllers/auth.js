import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import errors from "../errors.js"

const {getErrorMessage} = errors;

//register
export const register = async (req,res)=>{
    
    try {
        const email = req.body.email;
        const row = await User.findByEmail(email);
        if (row) {
            return res.status(400).json({ error: 'User Already Exists' });
        }

        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;

        //hash pass, then create new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        user.password = hash;
        user.isAdmin = req.body.isAdmin === 'true' ? true : false;
        user.status = 'active';
        
        await user.save();
        return res.status(200).json({success:true, 'message':'User Registered Successfully', 'data':user})  
    } catch (error) {
        // return res.status(500).json("Something Went Wrong")
        return res.status(500).json(error.message)
        //return res.status(200).json({ error });
    }
     
};

//login
export const login = async (req,res)=>{
    
    try {
        const email = req.body.email;
        const user = await User.findByEmailOrFail(email);
        
        //check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({'success':false, 'message':'Incorrect email or password'});

        //jwt, store in cookie
        //const token = jwt.sign({ id: user.id }, "jwtKey");
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_KEY
        );

        const { password, ...other } = user;
        other.token = token;
        //console.log(other)
        res.cookie("jwt_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({'success':true, 'data':other});
        
    } catch (error) {
        return res.status(500).json({'success':false, 'message':error.message})
    }
    
};

//logout
export const logout = (req,res)=>{
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("User logged Out")
};

//single auth user
export const singleAuthUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findByIdOrFail(id);
      
      return res.status(200).json({'success':true, 'data':user});
    } catch (error) {
      return res.status(500).json(error);
      //next(error);
    }
};

//single any user
export const singleAnyUser = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findByIdOrFail(id);
      
      return res.status(200).json({'success':true, 'data':user});
    } catch (error) {
      return res.status(500).json(error.message);
    }
};