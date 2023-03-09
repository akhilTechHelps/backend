const express = require("express")
const roleController = require("../controller/roleController")
const uploader = require(".././middleware/uploader")
const router = express.Router()

router
  .post("/", roleController.storerole)
  .get("/", roleController.getroleById)
  .get("/list", roleController.getroleList)
  .put("/", roleController.updateroleByID)
  .delete("/", roleController.deleteroleById)
  .post("/bulkInsert", uploader.single("fileCSV"), roleController.insertBulkrole)
  .post("/bulkUpdate", uploader.single("fileCSV"),roleController.updateBulkrole)

module.exports = router




