import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req,res)=>{
    //check user exist
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(q, [req.body.email, req.body.username], (err,data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("User already exists");
    
        //hash pass, then create new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        //insert query
        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash //as hashed password
        ]
        db.query(q, [values], (err,data)=>{
            if(err) return res.json(err)
            return res.status(200).json("User registered successfuly")
        })

    })

}

export const login = (req,res)=>{
    const q = "SELECT * FROM users WHERE username = ?"
    const values = [
        req.body.username,
    ]
    db.query(q, [values], (err,data)=>{
        if(err) return res.json(err)
        if(data.length == 0) return res.status(404).json("User Not Found");
    
        //check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
        if(!isPasswordCorrect) return res.status(400).json("Incorrect Username or Password");
        
        //jwt, store in cookie
        const token = jwt.sign({ id: data[0].id }, "jwtKey");
        const { password, ...other } = data[0];
        other.token = token;
        //console.log(other)
        res.cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json(other);

// save as above res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
    }) 
};

export const logout = (req,res)=>{
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("User logged Out")
}