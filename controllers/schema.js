import { db } from "../db.js";

const connection = db;
const db_name = 'travul9ja';

export const createSchema = (req,res)=>{
    
    connection.connect((error) => {
        if (error) {
          console.error('Error connecting to the database server:', error);
          return;
        }
       
        console.log('Connected to the database server');
      
        // Drop the database if it exists
        connection.query('DROP DATABASE IF EXISTS '+db_name, (error, results) => {
          if (error) {
            console.error('Error dropping the database:', error);
            return;
          }
      
          console.log('Database dropped');
          
          // Create the database
          connection.query('CREATE DATABASE '+db_name, (error, results) => {
            if (error) {
              console.error('Error creating the database:', error);
              return;
            }
      
            console.log('Database created');
            
            // Switch to the newly created database
            connection.query('USE '+db_name, (error, results) => {
              if (error) {
                console.error('Error switching to the database:', error);
                return;
              }
      
              console.log('Using the database');
      
              // Create tables
              const createTablesQuery = `
                CREATE TABLE users (
                    id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    profile_picture VARCHAR(255) NULL,
                    status VARCHAR(45) NOT NULL DEFAULT 'active',
                    created_at VARCHAR(255) NULL,
                    updated_at VARCHAR(255) NULL,
                    UNIQUE INDEX id_UNIQUE (id ASC),
                    PRIMARY KEY (id),
                    UNIQUE INDEX email_UNIQUE (email ASC)
                );
        
                CREATE TABLE posts (
                  id INT PRIMARY KEY,
                  title VARCHAR(100),
                  content TEXT
                );
              `;
              connection.query(createTablesQuery, (error, results) => {
                if (error) {
                  console.error('Error creating tables:', error);
                  return;
                }
      
                console.log('Tables created');
                return res.status(404).json("Db Tables Migrated Successful");
                
                // Close the connection
                // connection.end((error) => {
                //   if (error) {
                //     console.error('Error closing the connection:', error);
                //     return;
                //   }
      
                //   console.log('Connection closed');
                //   return res.status(404).json("Db Migration Successful");
                // });
              });
            });
          });
        });
    });
}
