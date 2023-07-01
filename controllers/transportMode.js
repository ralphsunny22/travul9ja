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

//unused
export const getSingleTransportMode2 = (req,res)=>{
    const q = "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN transport_modes p ON u.id=p.uid WHERE p.id = ?";

    db.query(q, [req.params.id], (err,data)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json(data[0]);
    })
};

export const getSingleTransportMode = async (req, res) => {
    try {
      const id = req.params.id;
      const transportMode = await TransportMode.findById(id);
      
      return res.status(200).json(transportMode);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
  
//unused
export const addTransport = (req,res)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) return res.status(500).json("Unauthorised Process")

    jwt.verify(token, "jwtKey", (err, userInfo)=>{
        if(err) return res.status(403).json("Invalid Token")

        //insert query
        const q = "INSERT INTO transport_modes(`type`,`name`,`image`,`description`,`color`,`features`,`category_id`,`owner`,`current_driver`,`date_manufactured`,`quality`,`seat_capacity`,`company_number`,`plate_number`,`other_features`,`status`,`created_at`,`updated_at`) VALUES (?)"
        const values = [
            req.body.type,
            req.body.name,
            req.body.image,
            req.body.description,
            req.body.color,
            req.body.features,
            req.body.category_id,
            req.body.owner,
            req.body.current_driver,
            req.body.date_manufactured,
            req.body.quality,
            req.body.seat_capacity,
            req.body.company_number,
            req.body.plate_number,
            req.body.other_features,
            req.body.status,
            req.body.created_at,
            req.body.updated_at, 
        ]
        db.query(q, [values], (err,data)=>{
            if(err) return res.json(err)
            return res.status(200).json("Transport Mode Created Successfuly")
        })
    })
}

export const addTransportMode = async (req,res)=>{
    
  try {
    const transportMode = new TransportMode();
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

export const deleteTransportMode = async (req,res)=>{
    
    try {            
        const id = req.params.id;
        const transportMode = await TransportMode.findByIdOrFail(id);
        await transportMode.delete();
        return res.status(200).json({'success':true, 'message':'Transport mode removed successfully'});
    } catch (error) {
        return res.status(500).json({'success':false, 'message':error.message})
    }

    jwt.verify(token, "jwtKey", (err, userInfo)=>{
        if(err) return res.status(403).json("Invalid Token")
        
        const transportModeId = req.params.id

        const q = "DELETE FROM transport_modes WHERE `id` = ? AND `uid` = ?"
        
        db.query(q, [transportModeId, userInfo.id], (err,data)=>{
            if(err) return res.status(403).json("You cannot perform this action")
    
            return res.status(200).json("TransportMode Deleted Successfully");
        })
    })

}

export const updateTransportMode = (req,res)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) return res.status(500).json("Unauthorised Process")

    jwt.verify(token, "jwtKey", (err, userInfo)=>{
        if(err) return res.status(403).json("Invalid Token")

        const transportModeId = req.params.id
        //insert query
        const q = "UPDATE transport_modes SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat, 
        ]
        db.query(q, [...values, transportModeId, userInfo.id], (err,data)=>{
            if(err) return res.json(err)
            return res.status(200).json("TransportMode Updated Successfuly")
        })
    })
}