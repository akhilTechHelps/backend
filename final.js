const { GoogleSpreadsheet } = require("google-spreadsheet")
const creds = require("./pass.json") // the file saved above
var fs = require("fs")
const { model } = require("mongoose")

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
  try {
    fs.writeFileSync(name, obj)
    return true
  } catch (e) {
    return e.message
  }
}

const readFile = async (name) => {
  try {
    const data = fs.readFileSync(name, "utf8")
    return data
  } catch (err) {
    console.error(err)
  }
}

const modelIf = async (txt, header, rows) => {
  if (txt.includes(`@if${header}con`)) {
    const s = new RegExp(`@if${header}con.*@if${header}con`, "gm")
    let k = txt.match(s)[0]
    k = k.replaceAll(`@if${header}con`, "").trim()
    kArr = k.split(";")
    console.log(kArr.length)
    if (kArr.includes(rows[header])) {
      txt = txt.replaceAll(s, "")
      txt = txt.replaceAll(`@${header}`, "")
      const s2 = new RegExp(`@if${header}true.*@if${header}true`, "gm")
      let t = txt.match(s2)[0]
      t = t.replaceAll(`@if${header}true`, "").trim()
      tArr = t.split(";")
      console.log(tArr[kArr.indexOf(rows[header])])
      txt = txt.replaceAll(s2, tArr[kArr.indexOf(rows[header])])
      const s1 = new RegExp(`@if${header}false.*@if${header}false`, "gm")
      txt = txt.replaceAll(s1, "")
      return [true, txt]
    } else {
      txt = txt.replaceAll(s, "")
      txt = txt.replaceAll(`@${header}`, "")
      txt = txt.replaceAll(`@if${header}false`, "")
      const s1 = new RegExp(`@if${header}true.*@if${header}true`, "gm")
      txt = txt.replaceAll(s1, "")
      return [false, txt]
    }
  }
  return [false, txt]
}

const gen = async (rows, header) => {
  var modelNames = []
  let planetxt = await readFile(`./template/model.txt`)
  let struct = planetxt.match(/\[\[.*\]\]/gm)[0]
  let txt = planetxt
  txt = txt.replaceAll("[[", "")
  txt = txt.replaceAll("]]", "")
  struct = struct.replaceAll("[[", "")
  struct = struct.replaceAll("]]", "")

  var initialName = rows[0].model_name
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].model_name != initialName) {
      txt = txt.replaceAll(`${struct}@rep@`, "")
      await createFile(txt, `./models/${rows[i - 1].model_name}Model.js`)
      modelNames.push(rows[i - 1].model_name)
      initialName = rows[i - 1].model_name
      txt = planetxt
      txt = txt.replaceAll("[[", "")
      txt = txt.replaceAll("]]", "")
      struct = struct.replaceAll("[[", "")
      struct = struct.replaceAll("]]", "")
    }
    for (let j = 0; j < header.length; j++) {
      const op = await modelIf(txt, header[j], rows[i])
      txt = op[1]
      if (op[0]);
      else {
        if (rows[i][header[j]] === "n") {
          const s = new RegExp(`@${header[j]}.*@${header[j]}`, "gm")
          txt = txt.replace(s, "")
        } else {
          txt = txt.replaceAll(`@${header[j]}`, "")
          if (rows[i][header[j]] === "y") {
            txt = txt.replaceAll(`${header[j]}value`, true)
          } else {
            txt = txt.replaceAll(`${header[j]}value`, rows[i][header[j]])
          }
        }
      }
    }
    txt = txt.replace("@rep@", `${struct}@rep@`)
  }
  txt = txt.replaceAll(`${struct}@rep@`, "")
  txt = txt.replaceAll(`${header[0]}`, `${rows[rows.length - 1].model_name}`)
  await createFile(txt, `./models/${rows[rows.length - 1].model_name}Model.js`)
  modelNames.push(rows[rows.length - 1].model_name)
  return modelNames
}

const main = async () => {
  const doc = await getAuth("1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ")
  const sheet = doc.sheetsByTitle["model"]
  const rows = await sheet.getRows()
  const v = await gen(rows, sheet.headerValues)
  for (let i = 0; i < v.length; i++) {
    let routetxt = await readFile(`./template/route.txt`)
    routetxt = routetxt.replaceAll(/model_name/gm, `${v[i]}`)
    await createFile(routetxt, `./routes/${v[i]}Route.js`)
    let controllertxt = await readFile(`./template/controller.txt`)
    controllertxt = controllertxt.replaceAll(/model_name/gm, `${v[i]}`)
    await createFile(controllertxt, `./controller/${v[i]}Controller.js`)
  }
  fs.copyFileSync("./template/uploader.txt", "./middleware/uploader.js")
  fs.copyFileSync("./template/validator.txt", "./models/validator.js")
}

main()
