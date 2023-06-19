const { GoogleSpreadsheet } = require("google-spreadsheet")
const creds = require("./pass.json") // the file saved above
var fs = require("fs")

const getAuth = async (id) => {
  try {
    // https://docs.google.com/spreadsheets/d/1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ/edit?usp=sharing
    const doc = new GoogleSpreadsheet(id)
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()
    return doc
  } catch (e) {
    return e.message
  }
}

const createFile = async (obj, name) => {
  console.log(name)
  try {
    fs.writeFileSync(name, JSON.stringify(obj))
    return true
  } catch (e) {
    return e.message
  }
}

const getModelJson = async (doc, title) => {
  try {
    var modelsArr = []
    var typeMap = ["any", "string", "number", "boolean", "object", "array", "date", "buffer", "geopoint", "id"]

    var app = { class_name: "", fields: {} }
    const sheet = doc.sheetsByTitle[title]

    const rows = await sheet.getRows()
    console.log(typeof rows[0].model_name)
    // app["class_name"] = rows[0].model_name

    // for (let i = 0; i < rows.length; i++) {
    //   if (rows[i].model_name != app.class_name) {
    //     modelsArr.push(app)
    //     app = { class_name: "", fields: {} }
    //     app["class_name"] = rows[i - 1].model_name
    //   }

      // app.fields[rows[i].field_name] = Object.assign(
      //   rows[i].constraints === "for_key" && { type: "Schema.Types.ObjectId", ref: rows[i].for_key, type: rows[i].field_type },
      //   rows[i].constraints === "unique" && { unique: true },
      //   rows[i].min && { min: Number(rows[i].min) },
      //   rows[i].max && { max: Number(rows[i].max) },
      //   rows[i].regex && {
      //     validate: {
      //       validator: "RegexHelper.PhoneNumber",
      //       message: rows[i].regex_msg,
      //     },
      //   },
      //   rows[i].mandatory === "y" ? (rows[i].mandatory_msg ? { require: [true, rows[i].mandatory_msg] } : { require: [true] }) : undefined
      // )
    // }
    // modelsArr.push(app)
    return rows[0].model_name
  } catch (err) {
    return err.message
  }
}

module.exports = { getAuth, getModelJson }

// Object.assign({ jhgj: "jrghu" }, false ? undefined : { om: " efyhuj" })
