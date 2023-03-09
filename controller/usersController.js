const { set } = require("mongoose")
const users = require("../models/usersModel")

const getusersList = async (req, res, next) => {
  try {
    let data = await users.find()
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const updateusersByID = async (req, res, next) => {
  try {
    let id = req.query.id
    let updateData = req.body
    const updatedData = await users.findByIdAndUpdate(id, { $set: updateData })
    res.status(200).json({ messgae: "users updated" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const getusersById = async (req, res, next) => {
  try {
    let id = req.query.id
    let data = await users.findById(id)
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deleteusersById = async (req, res, next) => {
  try {
    let id = req.query.id
    const updatedData = await users.findByIdAndRemove(id)
    res.status(200).json({ messgae: "users deleted" })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const storeusers = async (req, res, next) => {
  try {
    let newModel = new users(req.body)
    const data = await newModel.save()
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}


const updateBulkusers = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          const id = data[x].id
          delete data[x].id
          await users.findByIdAndUpdate(id, { $set: data[x] })
        }
      })
    res.status(200).json({ message: "Bulk Update Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const insertBulkusers = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          console.log(data[x])
          let newModel = new users(data[x])
          await newModel.save()
        }
      })
    res.status(200).json({ message: "Bulk Insert Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

module.exports = {
  getusersList,
  storeusers,
  getusersById,
  deleteusersById,
  updateusersByID,
  updateBulkusers,
  insertBulkusers
}
