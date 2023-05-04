// const fs = require("fs");
// const readdir = require("fs/promises");
// const path = require("path");

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

// call the function and pass the folder path

// process.stdout.write("Hi! Write some text...\n");

// const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"));

// process.stdin.on("data", input => {
//   if (input.toString() === "exit\n") {
//     process.stdout.write("Bye! See you soon!\n");
//     process.exit();
//   }

//   // writeStream.write(input);
//   fs.appendFile(path.join(__dirname, "text.txt"), input, err => {
//     if (err) throw err.message;
//   });
// });

// process.on("SIGINT", () => {
//   process.stdout.write("\nBye! See you soon!\n");
//   process.exit();
// });

// fs.writeFile(path.join(__dirname, "text.txt"), "", err => {
//   if (err) throw err;
//   console.log("Write something down to the file:");
// });

// const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
// readStream.on("data", input => {});

// process.on("beforeExit", err => {
//   if (err) throw err;
//   process.stdout.write("Bye! See you soon!\n");
// });

// const readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
// let data = "";
// readStream.on("data", chunk => (data += chunk));
// readStream.on("end", () => console.log(data));
// readStream.on("error", error => console.log(error.message));

// readStream.pipe(process.stdout);

// --------------------------------------------

// const EventEmitter = require("events");
// const emitter = new EventEmitter();

// emitter.on("start", data => console.log("start", data));

// emitter.prependListener("start", () => console.log(333333));
// emitter.emit("start", 123);
// ------------------------------
// const os = require("os");
// const http = require("http");

// const PORT = 3000;

// const requestHandler = (req, res) => {
//   console.log(`Got ${http.method}-request for ${http.url}`);
//   res.write("Hi Node!");
//   res.write("By Nody");
// };

// const server = http.createServer(requestHandler);

// server.listen(PORT, "localhost", () => {
//   console.log(`Running on ${PORT}`);
// });

// fs.mkdir(path.join(__dirname, "bibon"), error => {
//   if (error) throw error;
//   console.log("Folder is created");
// });

// fs.writeFile(path.join(__dirname, "bibon", "mynotes.txt"), "Here's your notes!", err => {
//   if (err) throw err;
//   console.log("Checkout out the files");
// });

// fs.appendFile(path.join(__dirname, "bibon", "mynotes.txt"), "-324-----new Info123", err => {
//   if (err) throw err;
//   console.log("File changed");
// });

// fs.rename(
//   path.join(__dirname, "bibon", "mynotes.txt"),
//   path.join(__dirname, "bibon", "myAWEFOMEnotes.txt"),
//   err => {
//     if (err) throw err;
//     console.log("renamed");
//   }
// );
