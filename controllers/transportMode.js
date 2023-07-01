import { db } from "../db.js";
import jwt from "jsonwebtoken";
import TransportMode from "../models/TransportMode.js";
import errors from "../errors.js";

const {getErrorMessage} = errors;

export const getAllTransportModes = (req,res)=>{
    const q = req.query.cat
        ? "SELECT * FROM transport_modes WHERE cat=?"
        : "SELECT * FROM transport_modes";

        console.log('Cookies: ', req.cookies)

    db.query(q, [req.query.cat], (err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data);
    })
    //return res.status(200).json('kk')
    
};

//single object
export const getSingleTransportMode = async (req, res) => {
    try {
      const id = req.params.id;
      const transportMode = await TransportMode.findById(id);
      
      return res.status(200).json(transportMode);
    } catch (error) {
      return res.status(500).json(error.message);
    }
};
  
//add new
export const addTransportMode = async (req,res, next)=>{
    
  try {
    const transportMode = new TransportMode();
    const company_number = req.body.company_number ? req.body.company_number : '' ;
    const plate_number = req.body.plate_number ? req.body.plate_number : '' ;

    //check duplicate
    const affectedColumns = await transportMode.isUnique(company_number, plate_number); //grab affectedColumns frm instantiated class object
    //remove duplicate columns
    const unique = arr => [...new Set(arr)];
    const unique_affectedColumns = unique(affectedColumns);
    if(unique_affectedColumns.length > 0) return res.status(400).json({'success':false, 'Duplicate entry found in columns':unique_affectedColumns});
    
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
    transportMode.availability = 'available';
    transportMode.status = 'active';

    await transportMode.save();
    return res.status(200).json("Transport Mode Created Successfuly")  
  } catch (error) {
    return res.status(500).json(error)
    const errorCode = error.code;
    const errorMessage = getErrorMessage(errorCode);
    return res.status(500).json(errorMessage); 
  }
   
}

//update
export const updateTransportMode = async (req,res)=>{
    
    try {

        //get id param       
        const id = req.params.id;
        //grab object from database
        const transportMode = await TransportMode.findByIdOrFail(id);

        const company_number = req.body.company_number ? req.body.company_number : '' ;
        const plate_number = req.body.plate_number ? req.body.plate_number : '' ;

        //if oldValue not equal newValue, check unique records, before new records can be allowed
        if (transportMode.company_number !== company_number || transportMode.plate_number !== plate_number) {
            //check duplicate
            const affectedColumns = await transportMode.isUnique(company_number, plate_number); //grab affectedColumns frm instantiated class object
            //remove duplicate columns
            const unique = arr => [...new Set(arr)];
            const unique_affectedColumns = unique(affectedColumns);
            if(unique_affectedColumns.length > 0) return res.status(400).json({'success':false, 'Duplicate entry found in columns':unique_affectedColumns});
        }
        
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
        transportMode.id = id;
        //return res.status(200).json(transportMode) 
        await transportMode.update();
        return res.status(200).json("Transport Mode Updated Successfuly")  
      } catch (error) {
        return res.status(500).json(error.message)
      }

}

export const deleteTransportMode = async (req,res)=>{
    
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
