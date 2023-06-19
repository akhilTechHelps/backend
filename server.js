const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyPaser = require("body-parser")
const dotenv = require("dotenv")
const roleRoutes = require("./routes/roleRoute")
const usersRoutes = require("./routes/usersRoute")
const masterRoutes = require("./routes/masterRoute")
const cors = require("cors")
const session = require('express-session');



const app = express()
dotenv.config()
app.use(cors());
app.use(morgan("dev"))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(bodyPaser.json())
app.use(session({
  secret: "techHelps",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); 


mongoose.connect("mongodb+srv://kartikmax1:kartikyadav@cluster0.gujnyuq.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", (err) => {
  console.log(err)
})

db.once("open", () => {
  console.log("Database Connected")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`)
})

app.use("/api/role", roleRoutes)
app.use("/api/master", masterRoutes)
app.use("/api/users", usersRoutes)
