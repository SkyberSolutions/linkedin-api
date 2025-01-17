import fs from 'fs/promises';
import path from 'path';


export const writeJsonToFile = async (res: any, filePath: string): Promise<void> => {
    try {
      // Convert the response object to JSON
      const data = JSON.stringify(res, null, 2); // null, 2 for pretty printing
      // Asynchronously write data to a file
      await fs.writeFile(filePath, data, 'utf8');
      console.log('File has been saved.');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  export const readJsonFromFile = async (filePath: string): Promise<any> => {
    try {
      // Asynchronously read data from file
      const data = await fs.readFile(filePath, 'utf8');
      // Parse the JSON data into a JavaScript object
      const obj = JSON.parse(data);
      console.log('File has been read.');
      return obj;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Rethrow or handle as needed
    }
  };

  /**
 * Deletes files with a specific extension in a given directory.
 * 
 * @param dirPath The directory to search for files to delete.
 * @param extension The file extension of files to delete. Example: '.txt'
 */
export async function deleteFilesByExtension(dirPath: string, extension: '.txt' | '.json', dryRun: boolean = false): Promise<void> {
  try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
          if (path.extname(file) === extension) {
              const filePath = path.join(dirPath, file);
              if (dryRun) {
                console.log(`Would delete (this is dryRun): ${filePath}`);
              } else {
                await fs.unlink(filePath);
                console.log(`Deleted: ${filePath}`);
              }
              
          }
      }
  } catch (error) {
      console.error(`An error occurred: ${error}`);
  }
}


export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}