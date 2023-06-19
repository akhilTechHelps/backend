import express from 'express';

const router = express.Router()
import usersController from "../controller/usersController.js";
import uploader from "../middleware/uploader.js";

router
.post("/", usersController.handleSignup)
  .post("/login", usersController.login)
  .post("/otp", usersController.handleVerifyOTP)
  .get("/", usersController.getusersById)
  .get("/list", usersController.getusersList)
  .put("/", usersController.updateusersByID)
  .delete("/", usersController.deleteusersById)
  .post("/bulkInsert", uploader.single("fileCSV"), usersController.insertBulkusers)
  .post("/bulkUpdate", uploader.single("fileCSV"), usersController.updateBulkusers)

export default router
