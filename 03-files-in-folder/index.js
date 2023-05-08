const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

async function getFileNames(folderPath) {
  const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    if (files[i].isDirectory()) {
      files.splice(i, 1);
    }
  }
  const fileNames = [];

  for (let file of files) {
    fileNames.push(file.name);
  }

  for (let name of fileNames) {
    const absPath = path.join(__dirname, "secret-folder", name);
    fs.stat(absPath, (err, stats) => {
      if (err) {
        console.log(err);
      } else if (!stats.isDirectory()) {
        console.log(
          name.split(".")[0] +
            " - " +
            path.extname(absPath).split(".")[1] +
            " - " +
            stats.size +
            " bytes"
        );
      }
    });
  }
}
getFileNames(path.join(__dirname, "secret-folder"));
