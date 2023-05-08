const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

(async function replaceTemplate() {
  const componentsDir = await fsPromises.readdir(path.join(__dirname, "components"), {
    withFileTypes: true,
  });

  fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true }, err => {
    if (err) throw err;
  });
  const indexWS = fs.createWriteStream(path.join(__dirname, "project-dist", "index.html"));
  const templateRS = fs.createReadStream(path.join(__dirname, "template.html"), "utf-8");

  const componentReadStreams = {};
  for (let component of componentsDir) {
    const stream = fs.createReadStream(path.join(__dirname, "components", component.name), "utf-8");
    componentReadStreams[component.name] = stream;
  }

  const componentChunks = {};

  const streamKeys = Object.keys(componentReadStreams);
  for (let i = 0; i < streamKeys.length; i++) {
    const key = streamKeys[i];
    componentChunks[key] = [];
  }
  for (let i = 0; i < streamKeys.length; i++) {
    for await (const chunk of componentReadStreams[streamKeys[i]]) {
      componentChunks[streamKeys[i]].push(Buffer.from(chunk));
    }
  }

  const componentStrings = {};
  for (const chunk in componentChunks) {
    const string = Buffer.concat(componentChunks[chunk]).toString("utf-8");
    componentStrings[chunk] = string;
  }

  const stringKeys = Object.keys(componentStrings);
  templateRS.on("data", input => {
    for (const key of stringKeys) {
      input = input.replace(`{{${key.split(".")[0]}}}`, componentStrings[key]);
    }
    indexWS.write(input);
  });

  (async function mergeStyles() {
    const output = fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"));

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
  })();

  (async function copyAssets() {
    fs.mkdir(path.join(__dirname, "project-dist", "assets"), { recursive: true }, err => {
      if (err) throw err;
    });

    async function copyAssetsDirectory(directory) {
      const initialFiles = await fsPromises.readdir(path.join(__dirname, "assets", directory), {
        withFileTypes: true,
      });

      for (let i = 0; i < initialFiles.length; i++) {
        if (initialFiles[i].isDirectory()) {
          initialFiles.splice(i, 1);
        }
      }
      const initialFileNames = [];

      for (let file of initialFiles) {
        initialFileNames.push(file.name);
      }

      fs.mkdir(
        path.join(__dirname, "project-dist", "assets", directory),
        { recursive: true },
        err => {
          if (err) throw err;
        }
      );

      for (let name of initialFileNames) {
        const pathInitialFile = path.join(__dirname, "assets", directory, name);
        const pathNewFile = path.join(__dirname, "project-dist", "assets", directory, name);

        fs.copyFile(pathInitialFile, pathNewFile, err => {
          if (err) throw err;
        });
      }
    }

    copyAssetsDirectory("fonts");
    copyAssetsDirectory("img");
    copyAssetsDirectory("svg");
  })();
})();
