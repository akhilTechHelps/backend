const { GoogleSpreadsheet } = require("google-spreadsheet")
const creds = require("./pass.json") // the file saved above
var shell = require('shelljs');
const fs = require('fs');
const templater = require("./templater")
const path = require('path');
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

const createFile = async (obj, name, path) => {
  try {
    if (path) {
      fs.mkdirSync(path, { recursive: true })
      fs.writeFileSync(path + name, obj)
      return true
    } else {
      fs.writeFileSync(name, obj)
      return true
    }
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

async function copyFile(sourcePath, destPath) {
  // Get absolute paths
  const absSourcePath = path.resolve(sourcePath);
  const absDestPath = path.resolve(destPath);

  // Create destination directory if it doesn't exist
  const destDir = path.dirname(absDestPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy file to destination
  fs.copyFileSync(absSourcePath, absDestPath);
}

const modelIf = async (txt1, header, rows) => {
  if (txt1.includes(`@if${header}con`)) {
    const s = new RegExp(`@if${header}con.*@if${header}con`, "gm")
    let k = txt1.match(s)[0]
    k = k.replaceAll(`@if${header}con`, "").trim()
    kArr = k.split(";")
    if (kArr.includes(rows[header])) {
      txt1 = txt1.replaceAll(s, "")
      txt1 = txt1.replaceAll(`@${header}`, "")
      const s2 = new RegExp(`@if${header}true.*@if${header}true`, "gm")
      let t = txt1.match(s2)[0]
      t = t.replaceAll(`@if${header}true`, "").trim()
      tArr = t.split(";")

      txt1 = txt1.replaceAll(s2, tArr[kArr.indexOf(rows[header])])
      const s1 = new RegExp(`@if${header}false.*@if${header}false`, "gm")
      txt1 = txt1.replaceAll(s1, "")
      return [true, txt1]
    } else {
      txt1 = txt1.replaceAll(s, "")
      txt1 = txt1.replaceAll(`@${header}`, "")
      txt1 = txt1.replaceAll(`@if${header}false`, "")
      const s1 = new RegExp(`@if${header}true.*@if${header}true`, "gm")
      txt1 = txt1.replaceAll(s1, "")
      return [false, txt1]
    }
  }
  return [false, txt1]
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

  var currentModelName = rows[0].model_name
  var currentModelIndex = 0
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].model_name != currentModelName) {
      txt = txt.replaceAll(`${struct}@rep@`, "")
      txt = txt.replaceAll(/model_name/gm, rows[currentModelIndex].model_name)
      await createFile(txt, `${rows[currentModelIndex].model_name}Model.js`,"./myappBE/models/")
      modelNames.push(rows[currentModelIndex].model_name)
      currentModelName = rows[i].model_name
      currentModelIndex = i
      txt = planetxt
      txt = txt.replaceAll("[[", "")
      txt = txt.replaceAll("]]", "")
      struct = struct.replaceAll("[[", "")
      struct = struct.replaceAll("]]", "")
    }
    for (let j = 0; j < header.length; j++) {
      const op = await modelIf(txt, header[j], rows[i])
      txt = op[1]
      if (!op[0]) {
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
  txt = txt.replaceAll(/model_name/gm, `${rows[currentModelIndex].model_name}`)

  await createFile(txt, `${rows[currentModelIndex].model_name}Model.js`,"./myappBE/models/")
  modelNames.push(rows[currentModelIndex].model_name)
  return modelNames
}


const main = async () => {
  const doc = await getAuth("176FCDkjpKiY3ZYOehpCo-VaNaPYQ32zLBNMFxaIilSY")
  const sheet = doc.sheetsByTitle["backend"]
  const rows = await sheet.getRows()
  const v = await gen(rows, sheet.headerValues)
  const sheetData = require("./data.json")
  templater(sheetData, "./template/server.hbs", "server.js", "./myappBE/")
  templater(sheetData, "./template/package.hbs", "package.json", "./myappBE/")
  
  for (let i = 0; i < v.length; i++) {

    if (v[i] === "Users") {
      let routetxt = await readFile(`./template/userRoute.txt`)
      let controllertxt = await readFile(`./template/userController.txt`)
      routetxt = routetxt.replaceAll(/model_name/gm, `${v[i]}`)
      await createFile(routetxt, `/${v[i]}Route.js`,"./myappBE/routes")
      controllertxt = controllertxt.replaceAll(/model_name/gm, `${v[i]}`)
      await createFile(controllertxt, `${v[i]}Controller.js`,"./myappBE/controller/")
    } else {
      let routetxt = await readFile(`./template/route.txt`)
      let controllertxt = await readFile(`./template/controller.txt`)
      routetxt = routetxt.replaceAll(/model_name/gm, `${v[i]}`)
      await createFile(routetxt, `${v[i]}Route.js`,"./myappBE/routes/")
      controllertxt = controllertxt.replaceAll(/model_name/gm, `${v[i]}`)
      await createFile(controllertxt, `${v[i]}Controller.js`,"./myappBE/controller/")
    }
  }
  
  await copyFile("./template/uploader.txt", "./myappBE/middleware/uploader.js")
  fs.copyFileSync("./template/validator.txt", "./myappBE/models/validator.js")
  fs.copyFileSync("./template/mastersController.txt", "./myappBE/controller/masterController.js")
  fs.copyFileSync("./template/masterRoute.txt", "./myappBE/routes/masterRoute.js")
  shell.cd("myappBE")
  // shell.exec("npm i")
}

main()
