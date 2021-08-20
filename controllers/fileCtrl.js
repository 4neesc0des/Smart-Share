const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

// multer setup
let storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads"),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    callback(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limt: { fileSize: 1000000 * 100 },
}).single("myfile");

const fileCtrl = {
  postFile: (req, res) => {
    // store file
    upload(req, res, async (err) => {
      // validate request
      if (!req.file) {
        return res.json({ msg: "All fields are required !" });
      }

      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      // store into database
      const file = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size,
      });

      const response = await file.save();
      return res.json({
        file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
      });
    });
    // response -> link
  },
  getFile: async (req, res) => {
    try {
      const file = await File.findOne({ uuid: req.params.uuid });
      if (!file) {
        return res.render("download", { msg: "link has been expired" });
      }

      return res.render("download", {
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      });
    } catch (err) {
      return res.render("download", { msg: "Something went wrong." });
    }
  },
  downloadFile: async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { msg: "link has been expired" });
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  },
  sendEmail: async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ msg: "All fields are required!!" });
    }
    // get data from dataBase
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ msg: "Email already sent!" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const data = await file.save();

    // send email
    const sendEmail = require("../services/emailServices");
    sendEmail({
      from: emailFrom,
      to: emailTo,
      subject: "SmartShare file sharing",
      text: `${emailFrom} shared file with You.`,
      html: require("./emailTemplate")({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + "KB",
        expires: "24 hours",
      }),
    })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err.message });
      });
  },
};

module.exports = fileCtrl;
