import { db } from "../db.js";

function slugify(the_string) {
    return the_string
      .toString() // Convert to string
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing whitespaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
 
//to handle promises
function queryDatabase(query, values) {
return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
    if (err) {
        console.log('reject unikey');
        reject(err);
    } else {
        console.log('resolve unique key');
        resolve(result);
    }
    });
});
}

export const createUniqueSlug = async (table_name, table_column_name, table_slug_column_name, the_string) => {
    const slug = slugify(the_string); // Generate the slug from the given name
  
  const existingSlugQuery = `
    SELECT slug FROM ${table_name} WHERE ${table_slug_column_name} = ?
  `;
  const existingSlugResult = await queryDatabase(existingSlugQuery, [slug]);
  // Check if there is any existing slug in the database that matches the generated slug
  
  if (existingSlugResult && existingSlugResult.length > 0) {
    // If an existing slug is found
    const maxSlugQuery = `
      SELECT ${table_slug_column_name} FROM ${table_name} WHERE ${table_column_name} = ? ORDER BY id DESC LIMIT 1
    `;
    const maxSlugResult = await queryDatabase(maxSlugQuery, [the_string]);
    // Retrieve the maximum slug for the given name (excluding the current slug)
    
    if (maxSlugResult && maxSlugResult.length > 0) {
      // If a maximum slug is found for the given name
      const max = maxSlugResult[0].slug;
      
      if (!isNaN(max.slice(-1))) {
        // If the last character of the maximum slug is a number
        const incrementedSlug = max.replace(/(\d+)$/, (match, p1) => {
          return parseInt(p1) + 1;
        });
        return incrementedSlug; // Return the incremented slug
      }
      
      return `${slug}-2`; // Append "-2" to the slug if the maximum slug doesn't end with a number
    }
  }
  
  return slug; // Return the generated slug if no conflicts are found
}