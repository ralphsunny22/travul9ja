import { db } from "../db.js";
import jwt from "jsonwebtoken";
import TransportMode from "../models/TransportMode.js";
import errors from "../errors.js";
import User from "../models/User.js";
import { createUniqueSlug } from "../utils/createUniqueSlug.js";
import { createUniqueKey } from "../utils/createUniqueKey.js";

const {getErrorMessage} = errors;

//////////////////////////////////////////////////////////

//getAll
export const getAllTransportModes = async (req,res) => {

    try {
        const transportModes = await TransportMode.all();

        const modifiedTransportModes = await Promise.all(
            transportModes.map(async (mode) => {
              // Fetch user information based on ID
              const user = await User.findById(mode.owner);
              const current_driver = await User.findById(mode.current_driver);
              // Append the object to each mode
              return { ...mode, owner: user, current_driver: current_driver };
            })
        );
        
        return res.status(200).json({'success':true, 'data':modifiedTransportModes});
      } catch (error) {
        return res.status(500).json(error.message);
      }
    
};

//single object
export const getSingleTransportMode = async (req, res) => {

  try {
    const id = req.params.id;
    const transportMode = await TransportMode.findByIdOrFail(id);
    
    return res.status(200).json({'success':true, 'data':transportMode}) 
  } catch (error) {
    return res.status(500).json(error.message);
  }
  
};
  
//add new
export const addTransportMode = async (req,res, next) => {
    
  try {
    const authUser = req.user.id; //coming from 'verifyAdmin' middleware
    
    const transportMode = new TransportMode();
    const company_number = req.body.company_number ? req.body.company_number : '' ;
    const plate_number = req.body.plate_number ? req.body.plate_number : '' ;

    const name = req.body.name ? req.body.name : '' ;
    const table_name = 'transport_modes';
    const table_column_name = 'name';
    const table_slug_column_name = 'slug';
    const the_string = name;
    
    //check unique slug
    const slug = await createUniqueSlug(table_name, table_column_name, table_slug_column_name, the_string)
    //return res.status(200).json({'success':true, 'name':slug});

    const table_column_unique = 'unique_key';
    //check unique_key
    const uniqueKey = await createUniqueKey(table_name, table_column_unique);
    //return res.status(200).json({'success':true, 'name':uniqueKey});

    //check duplicate
    const affectedColumns = await transportMode.isDuplicate(company_number, plate_number); //grab affectedColumns frm instantiated class object
    //remove duplicate columns
    const unique = arr => [...new Set(arr)];
    const unique_affectedColumns = unique(affectedColumns);
    if(unique_affectedColumns.length > 0) return res.status(400).json({'success':false, 'Duplicate entry found in columns':unique_affectedColumns});
    
    transportMode.unique_key = uniqueKey;
    transportMode.type = req.body.type;
    transportMode.name = req.body.name;
    transportMode.slug = slug;
    transportMode.image = req.body.image;
    transportMode.description = req.body.description;
    transportMode.color = req.body.color;
    transportMode.category_id = req.body.category_id;
    transportMode.owner = req.body.owner;
    transportMode.current_driver = req.body.current_driver;
    transportMode.date_manufactured = req.body.date_manufactured;
    transportMode.quality = req.body.quality;
    transportMode.seat_capacity = req.body.seat_capacity;
    transportMode.company_number = req.body.company_number;
    transportMode.plate_number = req.body.plate_number;
    transportMode.other_features = req.body.other_features;
    transportMode.availability = 'available';
    transportMode.created_by = authUser;
    transportMode.status = 'active';

    await transportMode.save();
    return res.status(200).json({'success':true, 'message':'Transport Mode Created Successfully', 'data':transportMode})  
  } catch (error) {
    return res.status(500).json(error)
    const errorCode = error.code;
    const errorMessage = getErrorMessage(errorCode);
    return res.status(500).json(errorMessage); 
  }
   
}

//update
export const updateTransportMode = async (req,res) => {
    
  try {

      //get id param       
      const id = req.params.id;
      //grab object from database
      const transportMode = await TransportMode.findByIdOrFail(id);

      const company_number = req.body.company_number ? req.body.company_number : '' ;
      const plate_number = req.body.plate_number ? req.body.plate_number : '' ;

      const name = req.body.name ? req.body.name : '' ;
      const table_name = 'transport_modes';
      const table_column_name = 'name';
      const table_slug_column_name = 'slug';
      const the_string = name;

      //if oldValue not equal newValue, check unique records, before new records can be allowed
      if (transportMode.name !== name) {
        //check unique slug
        const slug = await createUniqueSlug(table_name, table_column_name, table_slug_column_name, the_string)
        transportMode.slug = slug;
      } else {
        transportMode.slug = transportMode.slug;
      }
      
      //if oldValue not equal newValue, check unique records, before new records can be allowed
      if (transportMode.company_number !== company_number || transportMode.plate_number !== plate_number) {
          //check duplicate
          const affectedColumns = await transportMode.isDuplicate(company_number, plate_number); //grab affectedColumns frm instantiated class object
          //remove duplicate columns
          const unique = arr => [...new Set(arr)];
          const unique_affectedColumns = unique(affectedColumns);
          if(unique_affectedColumns.length > 0) return res.status(400).json({'success':false, 'Duplicate entry found in columns':unique_affectedColumns});
      }
      
      transportMode.unique_key = transportMode.unique_key;
      transportMode.type = req.body.type;
      transportMode.name = req.body.name;
      transportMode.image = req.body.image;
      transportMode.description = req.body.description;
      transportMode.color = req.body.color;
      transportMode.category_id = req.body.category_id;
      transportMode.owner = req.body.owner;
      transportMode.current_driver = req.body.current_driver;
      transportMode.date_manufactured = req.body.date_manufactured;
      transportMode.quality = req.body.quality;
      transportMode.seat_capacity = req.body.seat_capacity;
      transportMode.company_number = req.body.company_number;
      transportMode.plate_number = req.body.plate_number;
      transportMode.other_features = req.body.other_features;
      transportMode.availability = req.body.availability === 'available' ? 'available' : 'unavailable';
      transportMode.status = req.body.status === 'active' ? 'active' : 'inactive';
      transportMode.created_by = transportMode.created_by;
      transportMode.id = id;
      //return res.status(200).json(transportMode) 
      await transportMode.update();
      return res.status(200).json({'success':true, 'message':'Transport Mode Updated Successfully', 'data':transportMode})  
  } catch (error) {
    return res.status(500).json(error.message)
  }

}

//delete
export const deleteTransportMode = async (req,res) => {
    
  try {     
      //get id param       
      const id = req.params.id;
      //grab object from database
      const transportMode = await TransportMode.findByIdOrFail(id);

      //delete object
      await transportMode.delete();
      return res.status(200).json({'success':true, 'message':'Transport mode removed successfully'});
  } catch (error) {
    return res.status(500).json({'success':false, 'message':error.message})
  }

}
