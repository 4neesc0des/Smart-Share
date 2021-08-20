const mongoose = require("mongoose");
mongoose
  .connect(process.env.URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connection Successfull___");
  })
  .catch((err) => {
    console.log(`NOT CONNECTED !!! ${err}`);
  });
