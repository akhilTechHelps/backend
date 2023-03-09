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

const generator = async (to, from, fieldCount, save, template) => {
  let txt = await readFile(`./template/${template}.txt`)
  to = to.replaceAll("0", "false")
  to = to.replaceAll("1", "true")

  let struct = txt.match(/\[\[.*\]\]/gm)[0]
  txt = txt.replaceAll("[[", "")
  txt = txt.replaceAll("]]", "")
  struct = struct.replaceAll("[[", "")
  struct = struct.replaceAll("]]", "")

  for (let i = 0; i < Number(fieldCount); i++) {
    for (let j = 0; j < fromArr.length; j++) {
      if (toArr[j][i] === "false") {
        const s = new RegExp(`@${fromArr[j]}.*@${fromArr[j]}`, "gm")
        txt = txt.replace(s, "")
      } else {
        txt = txt.replaceAll(`@${fromArr[j]}`, "")
        if (toArr[j][i] === "true") {
          txt = txt.replace(`${fromArr[j]}value`, true)
        } else {
          txt = txt.replace(`${fromArr[j]}value`, toArr[j][i])
        }
      }
    }
    txt = txt.replace("@rep@", `${struct}@rep@`)
  }
  txt = txt.replaceAll(`${struct}@rep@`, "")
  txt = txt.replaceAll(`${fromArr[0]}`, `${toArr[0][0]}`)

  console.log(await createFile(txt, `${save}.js`))
}

const main = async () => {
  try {
    const doc = await getAuth("1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ")
    const sheet = doc.sheetsByTitle["model"]
    const rows = await sheet.getRows()
    // for (let i = 0; i < rows.length; i++) {
    //   generator(rows[i].to, rows[i].from, rows[i].fieldCount, rows[i].save, rows[i].template)
    // }
    // generator(rows[0].to, rows[0].from, rows[0].fieldCount, rows[0].save, rows[0].template)
  } catch (err) {
    console.log(err.message)
  }
}
