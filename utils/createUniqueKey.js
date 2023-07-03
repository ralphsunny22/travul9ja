import { db } from "../db.js";
import crypto from "crypto";

//to handle query promises
function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
        if (err) {
            console.log('reject');
            reject(err);
        } else {
            console.log('resolve');
            resolve(result);
        }
        });
    });
}

export const createUniqueKey = async (table_name, table_column_unique) => {
    // Generate a random string of length 30
  const randomString = generateRandomString(30);

  // Retrieve existing unique keys that match the generated random string
  const randomStrings = await getMatchingUniqueKeys(table_name, table_column_unique, randomString);
  
  let uniqueKey = randomString + generateRandomNumber(100000, 999999);
  
  // Check if the generated unique key is already present in the randomStrings array
  while (randomStrings.includes(uniqueKey)) {
    // Generate a new unique key until a non-duplicate is found
    uniqueKey = randomString + generateRandomNumber(100000, 999999);
  }
  
  // Return the unique key
  return uniqueKey;
}

// Helper function to generate a random string of the specified length
function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
  
// Helper function to generate a random number between the specified minimum and maximum values
function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
// Function to retrieve existing unique keys that match the given pattern
async function getMatchingUniqueKeys(table_name, table_column_unique, pattern) {
const query = `
    SELECT ${table_column_unique} FROM ${table_name} WHERE ${table_column_unique} LIKE ?
`;
const values = [pattern + '%'];

// execute the query
//const results = await db.query(query, values);
const results = await queryDatabase(query, values);

// Extract the unique keys from the query results
return results.map((row) => row.unique_key);
}
