import { db } from "../db.js";

class User {
    constructor() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.profile_picture = '';
        this.status = '';
        this.isAdmin = '';
        this.created_at = '';
        this.updated_at = '';
    }

    // Check if a record with the desired values already exists
  async isDuplicate(email) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT email
        FROM users
        WHERE email = ?
      `;

      const values = [
        email,
      ];

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
              if (row.email === email) {
                affectedColumns.push('email');
              }
            }
          }
          resolve(affectedColumns); // Resolve the promise with the uniqueness check result
        }
        
      });
    });
  }
  
    //save new object
    save() {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO users(
            name,
            email,
            password,
            profile_picture,
            isAdmin,
            status,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const now = new Date();
        const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
        const updatedAt = createdAt;
        this.created_at = createdAt; // Assign value to created_at property
        this.updated_at = updatedAt; // Assign value to updated_at property
  
        const values = [
            this.name,
            this.email,
            this.password,
            this.profile_picture,
            this.isAdmin,
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
          const query = 'SELECT * FROM users WHERE id = ?';
        
          const values = [id];
          db.query(query, values, (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
    
            if (rows.length === 0) {
              const emptyObj = '';
              resolve(emptyObj);
              return;
            }
    
            const user = new User();
            // Map the properties from the database rows to the user object
            user.id = rows[0].id;
            user.name = rows[0].name;
            user.email = rows[0].email;
            user.password = rows[0].password;
            user.profile_picture = rows[0].profile_picture;
            user.status = rows[0].status;
            user.isAdmin = rows[0].isAdmin;
            user.created_at = rows[0].created_at;
            user.updated_at = rows[0].updated_at;
    
            resolve(user);
          });
        });
    }

    //findByIdOrFail
    static findByIdOrFail(id) {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
      
        const values = [id];
        db.query(query, values, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
  
          if (rows.length === 0) {
            reject(new Error('User Not found'));
            return;
          }
  
          const user = new User();
          // Map the properties from the database rows to the user object
          user.id = rows[0].id;
          user.name = rows[0].name;
          user.email = rows[0].email;
          user.password = rows[0].password;
          user.profile_picture = rows[0].profile_picture;
          user.status = rows[0].status;
          user.isAdmin = rows[0].isAdmin;
          user.created_at = rows[0].created_at;
          user.updated_at = rows[0].updated_at;
  
          resolve(user);
        });
      });
  }

    //findByEmail
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM users WHERE email = ?';
        
          const values = [email];
          db.query(query, values, (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
    
            if (rows.length === 0) {
              const emptyObj = '';
              resolve(emptyObj);
              return;
            }
            
            const user = new User();
            // Map the properties from the database rows to the user object
            user.id = rows[0].id;
            user.name = rows[0].name;
            user.email = rows[0].email;
            user.password = rows[0].password;
            user.profile_picture = rows[0].profile_picture;
            user.status = rows[0].status;
            user.isAdmin = rows[0].isAdmin;
            user.created_at = rows[0].created_at;
            user.updated_at = rows[0].updated_at;
    
            resolve(user);
          });
        });
    }

    //findByEmailOrFail
    static findByEmailOrFail(email) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM users WHERE email = ?';
        
          const values = [email];
          db.query(query, values, (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
    
            if (rows.length === 0) {
                reject(new Error('User Not found'));
                return;
            }
            
            const user = new User();
            // Map the properties from the database rows to the user object
            user.id = rows[0].id;
            user.name = rows[0].name;
            user.email = rows[0].email;
            user.password = rows[0].password;
            user.profile_picture = rows[0].profile_picture;
            user.status = rows[0].status;
            user.isAdmin = rows[0].isAdmin;
            user.created_at = rows[0].created_at;
            user.updated_at = rows[0].updated_at;
    
            resolve(user);
          });
        });
    }

    //update class
    update() {
      return new Promise((resolve, reject) => {
        const query = `
        UPDATE transport_modes SET
            name = ?,
            email = ?,
            password = ?,
            profile_picture = ?,
            status = ?,
            isAdmin = ?,
            created_at = ?,
            updated_at = ?
          WHERE id = ?
        `;
        const now = new Date();
        const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
        const updatedAt = createdAt;
        this.updated_at = updatedAt; // Assign value to updated_at property
    
        const values = [
          this.name,
          this.email,
          this.password,
          this.profile_picture,
          this.status,
          this.isAdmin,
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
}

export default User;