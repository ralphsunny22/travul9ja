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
                    password VARCHAR(255) NULL,
                    isAdmin BOOLEAN NULL DEFAULT false,
                    profile_picture VARCHAR(255) NULL,
                    created_by INT NULL,
                    status VARCHAR(45) NOT NULL DEFAULT 'active',
                    created_at DATETIME NULL,
                    updated_at DATETIME NULL,
                    UNIQUE INDEX id_UNIQUE (id ASC),
                    PRIMARY KEY (id)
                );
                CREATE TABLE transport_modes (
                    id INT NOT NULL AUTO_INCREMENT,
                    unique_key LONGTEXT NULL,
                    type VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    slug LONGTEXT NULL,
                    image VARCHAR(255) NULL,
                    description LONGTEXT NULL,
                    color VARCHAR(255) NULL,
                    category_id INT NULL,
                    owner INT NULL,
                    current_driver INT NULL,
                    date_manufactured DATE NULL,
                    quality VARCHAR(255) NULL,
                    seat_capacity INT NULL,
                    company_number VARCHAR(255) NULL,
                    plate_number VARCHAR(255) NULL,
                    other_features LONGTEXT NULL,
                    availability VARCHAR(45) NULL DEFAULT 'available',
                    created_by INT NULL,
                    status VARCHAR(45) NOT NULL DEFAULT 'active',
                    created_at DATETIME NULL,
                    updated_at DATETIME NULL,
                    UNIQUE INDEX id_UNIQUE (id ASC),
                    PRIMARY KEY (id)
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
