import { db } from "../db.js";

class User {
    constructor() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.profile_picture = '';
        this.status = '';
        this.created_at = '';
        this.updated_at = '';
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
              reject(new Error('User not found'));
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
            user.created_at = rows[0].created_at;
            user.updated_at = rows[0].updated_at;
    
            resolve(user);
          });
        });
    }
}

export default User;