import * as fs from 'fs';


export const writeResponseToFile = async (res: any, filePath: string): Promise<void> => {
    try {
      // Convert the response object to JSON
      const data = JSON.stringify(res, null, 2); // null, 2 for pretty printing
      // Asynchronously write data to a file
      await fs.promises.writeFile(filePath, data, 'utf8');
      console.log('File has been saved.');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };