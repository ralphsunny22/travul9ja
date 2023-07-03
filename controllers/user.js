import User from "../models/User.js";
import bcrypt from "bcryptjs"

//update
export const updateUser = async (req,res) => {
    
    try {
        const authUser = req.user;
  
        //get id param       
        const id = req.params.id;
        // return res.status(500).json(id)
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
        
        user.unique_key = user.unique_key;
        user.name = req.body.name;
        user.email = req.body.email;

        user.profile_picture = req.body.profile_picture ? req.body.profile_picture  : user.profile_picture;
        user.isAdmin = req.body.isAdmin == 'true' ? true : false;
        user.status = req.body.status ? req.body.status  : user.status;
        user.created_by = user.created_by;
        user.id = id;
        
        //return res.status(200).json(user) 
        await user.update();
        return res.status(200).json({success:true, 'message':'User Updated Successfully', 'data':user})   
      } catch (error) {
        return res.status(500).json(error.message)
      }

}

//delete
export const deleteUser = async (req,res) => {
    
  try {     
      //get id param       
      const id = req.params.id;
      //grab object from database
      const user = await User.findByIdOrFail(id);

      //delete object
      await user.delete();
      return res.status(200).json({'success':true, 'message':'User Removed Successfully'});
  } catch (error) {
    return res.status(500).json({'success':false, 'message':error.message})
  }

}