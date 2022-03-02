const fs = require('fs');
const path = require('path');

// Base directory for reports
const baseDir = path.join(__dirname, '/../reports/');

const saveReport = async (dir, file, data, callback) => {
  // Create directory if not exist
  if (!fs.existsSync(`${baseDir + dir}`)) {
    fs.mkdirSync(`${baseDir + dir}`);
  }
  // Add new report file
  fs.open(`${baseDir + dir}/${file}.html`, 'wx', async (openError, fileDescriptor) => {
    if (!openError && fileDescriptor) {
      await fs.writeFile(fileDescriptor, data, async (writeError) => {
        if (!writeError) {
          await fs.close(fileDescriptor, (closeError) => {
            if (!closeError) {
              callback(`New performance report created successfully with name: ${file}`);
            } else {
              callback(`Error closing new report file: ${closeError}`);
            }
          });
        } else {
          callback(`Error writing new report file: ${writeError}`);
        }
      });
    } else {
      callback(`Error opening new report file: ${openError}`);
    }
  });
};

// Exporting function
module.exports = { saveReport };
