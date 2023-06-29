import mysql from "mysql"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"travul9ja",
    multipleStatements: true, // Enable multiple statements
})
