require("dotenv").config();
require("./db/conn");
const File = require("./models/file");
const fs = require("fs");

async function fetchData() {
  const pastDate = Date.now() - 24 * 60 * 60 * 1000;
  const files = await File.find({
    createdAt: { $lt: new Date(pastDate) },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

fetchData().then(process.exit);
