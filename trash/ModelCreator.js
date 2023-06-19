const fs = require("fs")
const om = require("simple-scaffold")
const path = require("path")
const { getAuth, getModelJson } = require("./xl_Scaffold.js")
require("dotenv").config()

const om1 = async (f) => {
  const data = await fs.promises.readFile(f, "utf8", async (err, jsonString) => {
    if (err) {
      console.log(err)
      return "gg"
    }

    return jsonString
  })
  return JSON.parse(data)

  // const { getData, getAuth } = require("./xl.js")
}

// const main = async () => {
//   try {
//     const doc = await getAuth("1df0PbQJJVPO9qXI9w9gVlqX02rErPHxJ2IVk2GnokfQ")
//     // const name = "app2"
//     const Data = await ge(doc, process.env.DB, name)
//     console.log(DBName)
//   }
//   catch(err){

//   }
// }

async function getUserModel() {
  const doc = await getAuth("1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ")
  const d = await getModelJson(doc, process.env.MODEL)

  console.log(d,"om")
  // d[0].fields = JSON.stringify(d[0].fields)
  // const config = {
  //   name: "component",
  //   templates: [path.join("model.txt")],
  //   output: path.join("models"),
  //   data: d[0],
  //   helpers: {
  //     twice: (text) => [text, text].join(" "),
  //   },
  //   beforeWrite: (content, rawContent, outputPath) => content.toString(),
  // }

  // const scaffold = await om.Scaffold(config)
  
  // fs.rename("./models/model.txt", `./models/${d[0].class_name}Model.js`, () => {
  //   console.log("\nFile Renamed!\n")
  // })
}

getUserModel()
