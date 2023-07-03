// errors.js

// Define your error mappings
const errorMappings = {
    ER_DUP_ENTRY: "Duplicate entry",
    // Add more error mappings as needed
};
  
// Function to get the corresponding SQL message for a given error code
const getErrorMessage = (errorCode) => {
  return errorMappings[errorCode] || "Unknown error";
};
  
export default {
  getErrorMessage,
};
  