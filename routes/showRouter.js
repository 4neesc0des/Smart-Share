const router = require("express").Router();
const fileCtrl = require("../controllers/fileCtrl");

router.route("/:uuid").get(fileCtrl.getFile);

module.exports = router;
