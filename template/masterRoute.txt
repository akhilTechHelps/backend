const express = require("express")
const masterController = require("../controller/masterController")
const uploader = require("../middleware/uploader")
const router = express.Router()

router
  .get("/", masterController.getList)

module.exports = router




