const router = require("express").Router();
const fileCtrl = require("../controllers/fileCtrl");

router.route("/").post(fileCtrl.postFile);
router.route("/send").post(fileCtrl.sendEmail);

module.exports = router;
