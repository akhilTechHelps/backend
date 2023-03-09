const express = require("express")
const usersController = require("../controller/usersController")
const uploader = require(".././middleware/uploader")
const router = express.Router()

router
  .post("/", usersController.storeusers)
  .get("/", usersController.getusersById)
  .get("/list", usersController.getusersList)
  .put("/", usersController.updateusersByID)
  .delete("/", usersController.deleteusersById)
  .post("/bulkInsert", uploader.single("fileCSV"), usersController.insertBulkusers)
  .post("/bulkUpdate", uploader.single("fileCSV"),usersController.updateBulkusers)

module.exports = router




