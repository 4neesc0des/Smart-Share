const router = require("express").Router();
const fileCtrl = require("../controllers/fileCtrl");

router.route("/:uuid").get(fileCtrl.downloadFile);

module.exports = router;
