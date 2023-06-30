import { db } from "../db.js";

class TransportMode2 {
    constructor() {
      this.type = '';
      this.name = '';
      this.image = '';
      this.description = '';
      this.color = '';
      this.features = '';
      this.category_id = '';
      this.owner = '';
      this.current_driver = '';
      this.date_manufactured = '';
      this.quality = '';
      this.seat_capacity = '';
      this.company_number = '';
      this.plate_number = '';
      this.other_features = '';
      this.availability = '';
      this.status = '';
      this.created_at = '';
      this.updated_at = '';
    }
    
    //save new
    save() {
      const q = `
        INSERT INTO transport_modes(
          type,
          name,
          image,
          description,
          color,
          category_id,
          owner,
          current_driver,
          date_manufactured,
          quality,
          seat_capacity,
          company_number,
          plate_number,
          other_features,
          availability,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const now = new Date();
      const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;

      this.created_at = createdAt; // Assign value to created_at property
      this.updated_at = updatedAt; // Assign value to updated_at property
     
      const values = [
        this.type,
        this.name,
        this.image,
        this.description,
        this.color,
        this.category_id,
        this.owner,
        this.current_driver,
        this.date_manufactured,
        this.quality,
        this.seat_capacity,
        this.company_number,
        this.plate_number,
        this.other_features,
        this.availability,
        this.status,
        this.created_at,
        this.updated_at,
      ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Transport Mode Created Successfully');
        
      });
    }
}


class TransportMode {
    constructor() {
        this.type = '';
        this.name = '';
        this.image = '';
        this.description = '';
        this.color = '';
        this.category_id = '';
        this.owner = '';
        this.current_driver = '';
        this.date_manufactured = '';
        this.quality = '';
        this.seat_capacity = '';
        this.company_number = '';
        this.plate_number = '';
        this.other_features = '';
        this.availability = '';
        this.status = '';
        this.created_at = '';
        this.updated_at = '';
    }
  
    //save new object
    save() {
      return new Promise((resolve, reject) => {
        const q = `
          INSERT INTO transport_modes(
            type,
            name,
            image,
            description,
            color,
            category_id,
            owner,
            current_driver,
            date_manufactured,
            quality,
            seat_capacity,
            company_number,
            plate_number,
            other_features,
            availability,
            status,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const now = new Date();
        const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
        const updatedAt = createdAt;
  
        const values = [
            this.type,
            this.name,
            this.image,
            this.description,
            this.color,
            this.category_id,
            this.owner,
            this.current_driver,
            this.date_manufactured,
            this.quality,
            this.seat_capacity,
            this.company_number,
            this.plate_number,
            this.other_features,
            this.availability,
            this.status,
            this.created_at,
            this.updated_at,
        ];
  
        db.query(q, values, (err, data) => {
          if (err) {
            reject(err); // Reject the promise with the error
            return;
          }
          resolve(); // Resolve the promise
        });
      });
    }

    //findById
    static findById(id) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM transport_modes WHERE id = ?';
        //   const query = `
        //     SELECT transport_modes.*, users.*
        //     FROM transport_modes
        //     JOIN users ON transport_modes.owner = users.id
        //     WHERE transport_modes.id = ?
        //     `;
          const values = [id];
          db.query(query, values, (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
    
            if (rows.length === 0) {
              reject(new Error('Transport mode not found'));
              return;
            }
    
            const transportMode = new TransportMode();
            // Map the properties from the database rows to the transportMode object
            transportMode.id = rows[0].id;
            transportMode.type = rows[0].type;
            transportMode.name = rows[0].name;
            transportMode.image = rows[0].image;
            transportMode.description = rows[0].description;
            transportMode.color = rows[0].color;
            transportMode.category_id = rows[0].category_id;
            transportMode.owner = rows[0].owner;
            transportMode.current_driver = rows[0].current_driver;
            transportMode.date_manufactured = rows[0].date_manufactured;
            transportMode.quality = rows[0].quality;
            transportMode.seat_capacity = rows[0].seat_capacity;
            transportMode.company_number = rows[0].company_number;
            transportMode.plate_number = rows[0].plate_number;
            transportMode.other_features = rows[0].other_features;
            transportMode.availability = rows[0].availability;
            transportMode.status = rows[0].status;

            // const owner = {
            //     id: transportMode.owner,
            //     name: transportMode.name, // Replace with the appropriate column from the users table
            //     // Include other user properties as needed
            //   };
            // // Include the owner data in the transport mode object
            // transportMode.owner = owner;
    
            resolve(transportMode);
          });
        });
    }
}
  

//module.exports = TransportMode;
// module.exports = { TransportMode };
export default TransportMode;

  
  