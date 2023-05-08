const fs = require("fs");
const path = require("path");

process.stdout.write("Hi! Write some text...\n");

const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"));

process.stdin.on("data", input => {
  if (input.toString() === "exit\n") {
    process.stdout.write("Bye! See you soon!\n");
    process.exit();
  }

  fs.appendFile(path.join(__dirname, "text.txt"), input, err => {
    if (err) throw err.message;
  });
});

process.on("SIGINT", () => {
  process.stdout.write("\nBye! See you soon!\n");
  process.exit();
});
