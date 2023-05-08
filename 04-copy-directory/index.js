(function copyDir() {
  const fsPromises = require("fs/promises");
  const fs = require("fs");
  const path = require("path");

  fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true }, err => {
    if (err) throw err;
  });

  async function copy() {
    const initialFiles = await fsPromises.readdir(path.join(__dirname, "files"), {
      withFileTypes: true,
    });

    const copiedFiles = await fsPromises.readdir(path.join(__dirname, "files-copy"), {
      withFileTypes: true,
    });

    for (let i = 0; i < initialFiles.length; i++) {
      if (initialFiles[i].isDirectory()) {
        initialFiles.splice(i, 1);
      }
    }
    const initialFileNames = [];
    const copiedFileNames = [];

    for (let file of initialFiles) {
      initialFileNames.push(file.name);
    }
    for (let file of copiedFiles) {
      copiedFileNames.push(file.name);
    }

    for (let name of initialFileNames) {
      const absPath = path.join(__dirname, "files", name);
      fs.copyFile(absPath, path.join(__dirname, "files-copy", name), err => {
        if (err) throw err;
      });
    }

    for (let name of copiedFileNames) {
      if (!initialFileNames.includes(name)) {
        fs.unlink(path.join(__dirname, "files-copy", name), err => {
          if (err) throw err;
        });
      }
    }
  }

  copy();
})();
