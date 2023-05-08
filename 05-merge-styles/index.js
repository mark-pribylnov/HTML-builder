const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

async function findCssFiles() {
  const initialFiles = await fsPromises.readdir(path.join(__dirname, "styles"), {
    withFileTypes: true,
  });

  const initialFileNames = [];

  for (let file of initialFiles) {
    if (file.name.slice(-4) === ".css") {
      initialFileNames.push(file.name);
    }
  }

  const readStreams = [];
  for (let fileName of initialFileNames) {
    const stream = fs.createReadStream(path.join(__dirname, "styles", fileName), "utf-8");
    readStreams.push(stream);
  }

  for (let input of readStreams) {
    input.pipe(output);
  }
}
findCssFiles();
