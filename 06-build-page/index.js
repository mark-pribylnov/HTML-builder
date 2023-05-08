const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
// const stream = require("stream");

(async function replaceTemplate() {
  // fs.rm(path.join(__dirname, "project-dist"), { recursive: true }, err => {
  //   if (err) throw err;
  // });

  fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true }, err => {
    if (err) throw err;
  });
  const indexWS = fs.createWriteStream(path.join(__dirname, "project-dist", "index.html"));
  const templateRS = fs.createReadStream(path.join(__dirname, "template.html"), "utf-8");
  const headerRS = fs.createReadStream(path.join(__dirname, "components", "header.html"), "utf-8");
  const footerRS = fs.createReadStream(path.join(__dirname, "components", "footer.html"), "utf-8");
  const articlesRS = fs.createReadStream(
    path.join(__dirname, "components", "articles.html"),
    "utf-8"
  );

  const chunksHeader = [];
  const chunksFooter = [];
  const chunksArticles = [];

  for await (const chunk of headerRS) {
    chunksHeader.push(Buffer.from(chunk));
  }
  for await (const chunk of footerRS) {
    chunksFooter.push(Buffer.from(chunk));
  }
  for await (const chunk of articlesRS) {
    chunksArticles.push(Buffer.from(chunk));
  }

  const stringHeader = Buffer.concat(chunksHeader).toString("utf-8");
  const stringFooter = Buffer.concat(chunksFooter).toString("utf-8");
  const stringArticles = Buffer.concat(chunksArticles).toString("utf-8");

  templateRS.on("data", input => {
    input = input.replace(`{{header}}`, stringHeader);
    input = input.replace(`{{articles}}`, stringArticles);
    input = input.replace(`{{footer}}`, stringFooter);
    indexWS.write(input);
  });
})();

(async function mergeStyles() {
  const output = fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"));

  const initialFiles = await fsPromises.readdir(path.join(__dirname, "styles"), {
    withFileTypes: true,
  });

  // const copiedFiles = await fsPromises.readdir(path.join(__dirname, "files-copy"), {
  //   withFileTypes: true,
  // });
  // console.log(initialFiles);
  // console.log(copiedFiles);

  const initialFileNames = [];
  // const copiedFileNames = [];

  for (let file of initialFiles) {
    if (file.name.slice(-4) === ".css") {
      initialFileNames.push(file.name);
    }
  }
  // for (let file of copiedFiles) {
  //   copiedFileNames.push(file.name);
  // }
  // console.log(initialFileNames);

  const readStreams = [];
  for (let fileName of initialFileNames) {
    const stream = fs.createReadStream(path.join(__dirname, "styles", fileName), "utf-8");
    readStreams.push(stream);
  }

  for (let input of readStreams) {
    input.pipe(output);
  }
  // for (let name of initialFileNames) {
  //   const absPath = path.join(__dirname, "files", name);
  //   fs.copyFile(absPath, path.join(__dirname, "files-copy", name), err => {
  //     if (err) throw err;
  //   });
  // }

  // for (let name of copiedFileNames) {
  //   if (!initialFileNames.includes(name)) {
  //     fs.unlink(path.join(__dirname, "files-copy", name), err => {
  //       if (err) throw err;
  //     });
  //   }
  // }
})();

(async function copyAssets() {
  fs.mkdir(path.join(__dirname, "project-dist", "assets"), { recursive: true }, err => {
    if (err) throw err;
  });

  // const assetsDirs = await fsPromises.readdir(path.join(__dirname, "assets"), {
  //   withFileTypes: true,
  // });

  async function copyAssetsDirectory(directory) {
    // const file = path.join(__dirname, "assets", directory);
    // fs.access(file, fs.constants.F_OK, err => {
    //   console.log(
    //     `\n------------------     ${file} ${
    //       err ? "DOES NOT EXIST" : "is here !!!"
    //     }     ------------------\n`
    //   );
    // });

    const initialFiles = await fsPromises.readdir(path.join(__dirname, "assets", directory), {
      withFileTypes: true,
    });
    // const copiedFiles = await fsPromises.readdir(
    //   path.join(__dirname, "project-dist", "assets", directory),
    //   {
    //     withFileTypes: true,
    //   }
    // );

    // console.log("--------SUCCESS--------");
    // console.log(initialFiles);
    // console.log(copiedFiles);

    for (let i = 0; i < initialFiles.length; i++) {
      if (initialFiles[i].isDirectory()) {
        initialFiles.splice(i, 1);
      }
    }
    // console.log(initialFiles);
    const initialFileNames = [];
    // const copiedFileNames = [];

    for (let file of initialFiles) {
      initialFileNames.push(file.name);
    }
    // for (let file of copiedFiles) {
    //   copiedFileNames.push(file.name);
    // }

    // console.log(initialFileNames);

    // const pathInitialFile = path.join(__dirname, "assets", directory, initialFileNames[0]);
    // const pathNewFile = path.join(
    //   __dirname,
    //   "project-dist",
    //   "assets",
    //   directory,
    //   initialFileNames[0]
    // );
    // console.log(pathInitialFile);
    // console.log(pathNewFile);

    //
    // fs.copyFile(pathInitialFile, pathNewFile, err => {
    //   if (err) throw err;
    // });
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
    // for (let name of copiedFileNames) {
    //   if (!initialFileNames.includes(name)) {
    //     fs.unlink(path.join(__dirname, "project-dist", "assets", directory), err => {
    //       if (err) throw err;
    //     });
    //   }
    // }
  }

  copyAssetsDirectory("fonts");
  copyAssetsDirectory("img");
  copyAssetsDirectory("svg");

  // for (const dir of assetsDirs) {
  //   copyAssetsDirectory(dir.name);
  // }
})();

// -_-_-_-_|-|-|_|_\_\_\_\_|_-_-_-_|-|-|_|_\_\_\_\_|_-_-_-_|-|-|_|_\_\_\_\_| OLD CODE
// (async function copyAssets() {
//   // const assetsDirs = await fsPromises.readdir(path.join(__dirname, "assets"), {
//   //   withFileTypes: true,
//   // });

//   async function copyAssetsDirectory(directory) {
//     // const file = path.join(__dirname, "assets", directory);
//     // fs.access(file, fs.constants.F_OK, err => {
//     //   console.log(
//     //     `\n------------------     ${file} ${
//     //       err ? "DOES NOT EXIST" : "is here !!!"
//     //     }     ------------------\n`
//     //   );
//     // });

//     const initialFiles = await fsPromises.readdir(path.join(__dirname, "assets", directory), {
//       withFileTypes: true,
//     });
//     // const copiedFiles = await fsPromises.readdir(
//     //   path.join(__dirname, "project-dist", "assets", directory),
//     //   {
//     //     withFileTypes: true,
//     //   }
//     // );

//     // console.log("--------SUCCESS--------");
//     // console.log(initialFiles);
//     // console.log(copiedFiles);

//     for (let i = 0; i < initialFiles.length; i++) {
//       if (initialFiles[i].isDirectory()) {
//         initialFiles.splice(i, 1);
//       }
//     }
//     // console.log(initialFiles);
//     const initialFileNames = [];
//     // const copiedFileNames = [];

//     for (let file of initialFiles) {
//       initialFileNames.push(file.name);
//     }
//     // for (let file of copiedFiles) {
//     //   copiedFileNames.push(file.name);
//     // }

//     // console.log(initialFileNames);

//     // const pathInitialFile = path.join(__dirname, "assets", directory, initialFileNames[0]);
//     // const pathNewFile = path.join(
//     //   __dirname,
//     //   "project-dist",
//     //   "assets",
//     //   directory,
//     //   initialFileNames[0]
//     // );
//     // console.log(pathInitialFile);
//     // console.log(pathNewFile);

//     //
//     // fs.copyFile(pathInitialFile, pathNewFile, err => {
//     //   if (err) throw err;
//     // });
//     fs.mkdir(
//       path.join(__dirname, "project-dist", "assets", directory),
//       { recursive: true },
//       err => {
//         if (err) throw err;
//       }
//     );
//     console.log(path.join(__dirname, "project-dist", "assets", directory));

//     for (let name of initialFileNames) {
//       const pathInitialFile = path.join(__dirname, "assets", directory, name);
//       const pathNewFile = path.join(__dirname, "project-dist", "assets", directory, name);

//       fs.copyFile(pathInitialFile, pathNewFile, err => {
//         if (err) throw err;
//       });
//     }
//     // for (let name of copiedFileNames) {
//     //   if (!initialFileNames.includes(name)) {
//     //     fs.unlink(path.join(__dirname, "project-dist", "assets", directory), err => {
//     //       if (err) throw err;
//     //     });
//     //   }
//     // }
//   }

//   copyAssetsDirectory("fonts");
//   // copyAssetsDirectory("img");
//   // copyAssetsDirectory("svg");

//   // for (const dir of assetsDirs) {
//   //   copyAssetsDirectory(dir.name);
//   // }
// })();
