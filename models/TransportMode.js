import { db } from "../db.js";

class TransportMode {
  constructor() {
      this.unique_key = '';
      this.type = '';
      this.name = '';
      this.slug = '';
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
      this.created_by = '';
      this.status = '';
      this.created_at = '';
      this.updated_at = '';
  }

  // Check if a record with the desired values already exists
  async isDuplicate(companyNumber, plateNumber) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT company_number, plate_number
        FROM transport_modes
        WHERE company_number = ? OR plate_number = ?
      `;

      const values = [
        companyNumber,
        plateNumber,
        // Add other values for the corresponding columns
      ];

      // db.query(query, values, (err, result) => {
        
      //   if (err) {
      //     reject(err); // Reject the promise with the error
      //     return;
      //   }

      //   const count = result[0].count;
      //   const isUnique = count === 0;

      //   resolve(isUnique); // Resolve the promise with the uniqueness check result
      // });
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
          return;
        } else {
          const affectedColumns = [];
          if (results[0]) {
            //reset array, to be sure its empty
            while(results[0].length > 0) {
              affectedColumns.pop();
            }

            //loop results & push now empty affectedColumns array
            for (const row of results) {
              if (row.company_number === companyNumber) {
                affectedColumns.push('company_number');
              }
              if (row.plate_number === plateNumber) {
                affectedColumns.push('plate_number');
              }
            }
          }
          resolve(affectedColumns); // Resolve the promise with the uniqueness check result
        }
        
      });
    });
  }

  //getAll
  static all() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM transport_modes';
  
      const values = [];
      db.query(query, values, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (rows.length === 0) {
          reject(new Error('No Data'));
          return;
        }

        resolve(rows);
      });
    });
  }
  
  //save new object
  save() {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO transport_modes(
          unique_key,
          type,
          name,
          slug,
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
          created_by,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const now = new Date();
      const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      this.created_at = createdAt; // Assign value to created_at property
      this.updated_at = updatedAt; // Assign value to updated_at property

      const values = [
          this.unique_key,
          this.type,
          this.name,
          this.slug,
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
          this.created_by,
          this.status,
          this.created_at,
          this.updated_at,
      ];

      db.query(query, values, (err, data) => {
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

  //findByIdOrFail
  static findByIdOrFail(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM transport_modes WHERE id = ?';
  
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
        transportMode.unique_key = rows[0].unique_key;
        transportMode.type = rows[0].type;
        transportMode.name = rows[0].name;
        transportMode.slug = rows[0].slug;
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
        transportMode.created_by = rows[0].created_by;
        transportMode.status = rows[0].status;
        transportMode.created_at = rows[0].created_at;
        transportMode.updated_at = rows[0].updated_at;

        resolve(transportMode);
      });
    });
  }

  //update class
  update() {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE transport_modes SET
          unique_key = ?,
          type = ?,
          name = ?,
          slug = ?,
          image = ?,
          description = ?,
          color = ?,
          category_id = ?,
          owner = ?,
          current_driver = ?,
          date_manufactured = ?,
          quality = ?,
          seat_capacity = ?,
          company_number = ?,
          plate_number = ?,
          other_features = ?,
          availability = ?,
          status = ?,
          created_by = ?,
          created_at = ?,
          updated_at = ?
        WHERE id = ?
      `;
      const now = new Date();
      const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = createdAt;
      this.updated_at = updatedAt; // Assign value to updated_at property
  
      const values = [
        this.unique_key,
        this.type,
        this.name,
        this.slug,
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
        this.created_by,
        this.created_at,
        this.updated_at,
        this.id,
      ];
  
      db.query(query, values, (err, data) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(); // Resolve the promise
        }
      });
    });
  };
    
  //delete object
  delete() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM transport_modes WHERE id = ?';
      
      const values = [this.id];

      db.query(query, values, (err, data) => {
        if (err) {
          reject(err); // Reject the promise with the error
          return;
        }
        resolve(); // Resolve the promise
      });
    });
  }
}
  

//module.exports = TransportMode;
// module.exports = { TransportMode };
export default TransportMode;

  
  