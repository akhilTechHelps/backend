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

const createJSONFile = async (obj, name) => {
  console.log(name)
  try {
    fs.writeFileSync(name, JSON.stringify(obj))
    return true
  } catch (e) {
    return e.message
  }
}

const getAppJSON = async (doc, title) => {
  try {
    const app = { name: "", description: "", directory: "", class: "Main", feature: "Enable prettier" }
    const sheet = doc.sheetsByTitle[title] // or use doc.sheetsById[id] or doc.sheetsByIndex[0]
    const rows = await sheet.getRows() // can pass in { limit, offset }

    // read/write row values sheet.rowCount, rows.length ,
    for (key in sheet.headerValues) {
      app[sheet.headerValues[key]] = rows[0][sheet.headerValues[key]]
      if (sheet.headerValues[key] === "name") {
        app.directory = rows[0][sheet.headerValues[key]]
      }
    }
    const fileName = await createJSONFile(app, `${rows[0].name}app.json`)
    if (fileName) {
      return { fileName: `${rows[0].name}app.json`, name: rows[0].name }
    }

    return false
  } catch (e) {
    return e.message
  }
}

const getDBJSON = async (doc, title, dic) => {
  try {
    const app = { name: "", connector: "mongodb", url: "", host: "", port: 4000, user: "", password: "", database: "" }
    const sheet = doc.sheetsByTitle[title] // or use doc.sheetsById[id] or doc.sheetsByIndex[0]
    const rows = await sheet.getRows() // can pass in { limit, offset }

    // read/write row values sheet.rowCount, rows.length ,
    for (key in sheet.headerValues) {
      app[sheet.headerValues[key]] = rows[0][sheet.headerValues[key]]
      if (sheet.headerValues[key] === "name") {
        app.database = rows[0][sheet.headerValues[key]]
      }
    }
    const fileName = await createJSONFile(app, `./${dic}/${rows[0].name}DB.json`)
    if (fileName) {
      return `${rows[0].name}DB.json`
    }

    return false
  } catch (e) {
    return e.message
  }
}

const getModelJson = async (doc, title) => {
  try {
    var typeMap = ["any", "string", "number", "boolean", "object", "array", "date", "buffer", "geopoint", "id"]
    const valueMap = { name: "model_name", type: "field_type", required: "mandatory", generated: "auto_generated", y: true, n: false, id: "number" }
    var app = { name: "", properties: {} }
    var field = { type: " ", required: " ", generated: " " }
    const sheet = doc.sheetsByTitle[title]
    const rows = await sheet.getRows()
    var om = []
    var m1 = rows[0].model_name
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].model_name != m1) {
        var m1 = rows[i].model_name
        let obj = {}
        obj[rows[i - 1].model_name] = app
        om.push(obj)
        obj = {}
        var app = { name: "", properties: {} }
      }
      app.name = rows[i].model_name
      for (let key of Object.keys(field)) {
        if (key === "type") {
          if (typeMap.includes(rows[i][valueMap[key]])) {
            field[key] = valueMap[rows[i][valueMap[key]]] === undefined ? rows[i][valueMap[key]] : valueMap[rows[i][valueMap[key]]]
          } else {
            return "Wrong DataType Input for Field value \n Must Be From : any, string, number, boolean, object, array, date, buffer, geopoint, id"
          }
        } else {
          field[key] = valueMap[rows[i][valueMap[key]]] === undefined ? rows[i][valueMap[key]] : valueMap[rows[i][valueMap[key]]]
        }

        if (key === "generated" && rows[i][valueMap[key]] === "y") {
          field["id"] = true
        }
      }
      app.properties[rows[i].field_name] = field
      var field = { type: " ", required: " ", generated: " " }
    }
    return om
  } catch (err) {
    return err.message
  }
}

module.exports = { getAppJSON, getDBJSON, getAuth, getModelJson }

//-----------------------------------------------END of CODE------------------------------------------

// getAppJSON("app")
// const getModelNames = async (doc, title) => {
//   console.log(title)
//   const sheet = doc.sheetsByTitle[title] // or use doc.sheetsById[id] or doc.sheetsByIndex[0]
//   const rows = await sheet.getRows()
//   const names = []
//   for (let i = 0; i < rows.length; i++) {
//     names.push(rows[i].model_name)
//   }
//   return names
//   // console.log(rows[0])
// }

// const om = async () => {
//   try {
//     // https://docs.google.com/spreadsheets/d/1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ/edit?usp=sharing

//     await doc.useServiceAccountAuth(creds) // Auth completed

//     await doc.loadInfo() // loads document properties and worksheets
//     console.log(doc.title)

//     await doc.updateProperties({ title: "omji" }) // updation project
//     console.log(doc.title)

//     const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
//     await sheet.updateProperties({ title: "gg" })
//     console.log(sheet.title)

//     // console.log(sheet.rowCount)

//     // adding / removing sheets
//     // const newSheet = await doc.addSheet({ title: "hot new sheet!" })
//     // console.log(newSheet.title)

//     // await newSheet.delete()

//     //////////////////////////// working with rows

//     // create a sheet and set the header row
//     // const sheet1 = await doc.addSheet({ headerValues: ["name", "email"] })

//     // // append rows
//     // const larryRow = await sheet1.addRow({ name: "Larry Page", email: "larry@google.com" })
//     // const moreRows = await sheet1.addRows([
//     //   { name: "Sergey Brin", email: "sergey@google.com" },
//     //   { name: "Eric Schmidt", email: "eric@google.com" },
//     // ])

//     // read rows
//     const rows = await sheet.getRows() // can pass in { limit, offset }

//     // read/write row values
//     console.log(sheet.rowCount, rows.length)
//     for (let i = 0; i < rows.length; i++) {
//       console.log(rows[i])
//     }
//     // for (key in rows) {
//     //   console.log(key)
//     //   console.log("\n" + "-----------------------" + "\n")
//     // }
//     // console.log(rows) // 'Larry Page'
//     // rows[1].email = "sergey@abc.xyz" // update a value
//     // await rows[1].save() // save updates
//     // await rows[1].delete() // delete a row

//     /////////////////////working with cells

//     // await sheet.loadCells("A1:E10") // loads range of cells into local cache - DOES NOT RETURN THE CELLS
//     // console.log(sheet.cellStats) // total cells, loaded, how many non-empty
//     // const a1 = sheet.getCell(0, 0) // access cells using a zero-based index
//     // const c6 = sheet.getCellByA1("C6") // or A1 style notation
//     // // access everything about the cell
//     // console.log(a1.value)
//     // console.log(a1.formula)
//     // console.log(a1.formattedValue)
//     // // update the cell contents and formatting
//     // a1.value = 123.456
//     // c6.formula = "=A1"
//     // a1.textFormat = { bold: true }
//     // c6.note = "This is a note!"
//     // await sheet.saveUpdatedCells() // save all updates in one call
//   } catch (e) {
//     console.log(e.message)
//   }
// }
// om()
