import User from "../models/User.js";
import bcrypt from "bcryptjs"

//update
export const updateUser = async (req,res)=>{
    
    try {

        //get id param       
        const id = req.params.id;
        //grab object from database
        const user = await User.findByIdOrFail(id);

        const email = req.body.email ? req.body.email : '' ;
        
        //if oldValue not equal newValue, check unique records, before new records can be allowed
        if (user.email !== email) {
          //check duplicate
          const affectedColumns = await user.isDuplicate(email); //grab affectedColumns frm instantiated class object
          //remove duplicate columns
          const unique = arr => [...new Set(arr)];
          const unique_affectedColumns = unique(affectedColumns);
          if(unique_affectedColumns.length > 0) return res.status(400).json({'success':false, 'Duplicate entry found in columns':unique_affectedColumns});
        }
        
        user.name = req.body.name;
        user.email = req.body.email;

        //hash pass, then create new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        user.password = hash;
        user.isAdmin = req.body.isAdmin == 'true' ? true : false;
        user.status = 'active';
        user.id = id;
        await user.update();
        
        //return res.status(200).json(user) 
        await user.update();
        return res.status(200).json("User Updated Successfuly")  
      } catch (error) {
        return res.status(500).json(error.message)
      }

}