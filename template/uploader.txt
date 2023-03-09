const path = require("path")
const multer = require("multer")
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  },
})
var uploads = multer({ storage: storage })

module.exports = uploads
