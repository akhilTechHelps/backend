const { set } = require("mongoose")
const role = require("../models/roleModel")

const getroleList = async (req, res, next) => {
  try {
    let data = await role.find()
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const updateroleByID = async (req, res, next) => {
  try {
    let id = req.query.id
    let updateData = req.body
    const updatedData = await role.findByIdAndUpdate(id, { $set: updateData })
    res.status(200).json({ messgae: "role updated" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const getroleById = async (req, res, next) => {
  try {
    let id = req.query.id
    let data = await role.findById(id)
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const deleteroleById = async (req, res, next) => {
  try {
    let id = req.query.id
    const updatedData = await role.findByIdAndRemove(id)
    res.status(200).json({ messgae: "role deleted" })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}

const storerole = async (req, res, next) => {
  try {
    let newModel = new role(req.body)
    const data = await newModel.save()
    res.status(200).json({ data })
  } catch (err) {
    res.status(400).json({ messgae: err.message })
  }
}


const updateBulkrole = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          const id = data[x].id
          delete data[x].id
          await role.findByIdAndUpdate(id, { $set: data[x] })
        }
      })
    res.status(200).json({ message: "Bulk Update Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

const insertBulkrole = async (req, res, next) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (data) => {
        for (var x = 0; x < data.length; x++) {
          console.log(data[x])
          let newModel = new role(data[x])
          await newModel.save()
        }
      })
    res.status(200).json({ message: "Bulk Insert Done" })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

module.exports = {
  getroleList,
  storerole,
  getroleById,
  deleteroleById,
  updateroleByID,
  updateBulkrole,
  insertBulkrole
}
