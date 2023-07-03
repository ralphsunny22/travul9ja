import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  //const token = req.cookies.access_token;
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    //return next(createError(401, "You are not authenticated!"));
    return res.status(403).json({ error: 'You are not authenticated!' });
  }
  
  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is not valid!' });
    req.user = user;
    next();
  });
};

//ownership
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => { // Pass next as an argument to verifyToken
    if (req.user.id == req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: 'You are not authorized!' });
    }
  });
};


//all admin users
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: 'You are not authorized!' });
    }
  });
};
