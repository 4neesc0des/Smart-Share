require("dotenv").config();
require("./db/conn");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const fileRouter = require("./routes/fileRouter");
const showRouter = require("./routes/showRouter");
const downloadRouter = require("./routes/download");

// cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

app.use(express.static("public"));
// templete engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// routers
app.use(express.json());
app.use("/api/files", fileRouter);
app.use("/files", showRouter);
app.use("/files/download", downloadRouter);

// server is running on port number 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
