import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import errors from "../errors.js"

const {getErrorMessage} = errors;

//unused
export const register2 = (req,res)=>{
    //check user exist
    const q = "SELECT * FROM users WHERE email = ? OR name = ?"
    
    db.query(q, [req.body.email, req.body.name], (err,data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("User already exists");
        
        //hash pass, then create new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        //insert query
        const q = "INSERT INTO users(`name`,`email`,`password`) VALUES (?)"
        const values = [
            req.body.name,
            req.body.email,
            hash //as hashed password
        ]
        db.query(q, [values], (err,data)=>{
            if(err) return res.json(err)
            return res.status(200).json("User registered successfuly")
        })

    })
}

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
        user.status = 'active';
        
        await user.save();
        return res.status(200).json("User Registered Successfully")  
    } catch (error) {
        // return res.status(500).json("Something Went Wrong")
        return res.status(500).json(error.message)
        //return res.status(200).json({ error });
    }
     
}

export const login = async (req,res)=>{
    
    try {
        const email = req.body.email;
        const user = await User.findByEmailOrFail(email);

        //check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({'success':false, 'message':'Incorrect email or password'});

        //jwt, store in cookie
        const token = jwt.sign({ id: user.id }, "jwtKey");
        const { password, ...other } = user;
        other.token = token;
        //console.log(other)
        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({'success':true, 'data':other});
        
    } catch (error) {
        return res.status(500).json({'success':false, 'message':error.message})
    }
    
};

export const logout = (req,res)=>{
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("User logged Out")
}