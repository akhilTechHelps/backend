const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyPaser = require("body-parser")
const dotenv = require("dotenv")
const roleRoutes = require("./routes/roleRoute")
const usersRoutes = require("./routes/usersRoute")



const app = express()
dotenv.config()
app.use(morgan("dev"))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(bodyPaser.json())

mongoose.connect("mongodb+srv://admin:adminadmin@cluster0.vpr1d.mongodb.net/Automation?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", (err) => {
  console.log(err)
})

db.once("open", () => {
  console.log("Database Connected")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`)
})

app.use("/api/role", roleRoutes)
app.use("/api/user", usersRoutes)
