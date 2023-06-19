var fs = require("fs")

const readFile = async (name) => {
  try {
    const data = fs.readFileSync(name, "utf8")
    return data
  } catch (err) {
    console.error(err)
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

const regexFun = (value, name) => {
  if (value.includes("Regex")) {
    return `!(${value}.test(formData.${name.split(" ").join("").toLowerCase()}))`
  } else {
    map = { eq: "===", gt: ">",lt:"<",lteq:"<=="}
    v = value.split(/[.()]/)
    return `!(formData.${name.split(" ").join("").toLowerCase()} ${map[v[1].trim()]} formData.${v[2]})`
  }
}





const replaceGen = (txt2, ch, to) => {
  txt2 = txt2.replace(`@${ch}@`, to)
  txt2 = txt2.replace(`@${ch}rep@`, `@${ch}@@${ch}rep@`)
  return txt2
}

const replaceRep = (txt3, arr) => {
  for (let i = 0; i < arr.length; i++) {
    txt3 = txt3.replaceAll(arr[i], "")
  }
  return txt3
}

const takeValue = (datav) => {
  return [datav.slice(0, datav.indexOf("(")), datav.slice(datav.indexOf("(") + 1, datav.lastIndexOf(")"))]
}

const getLogic = (data) => { 
  var state2 = {}
  let value = ""
  let v = {showsection:true,hidesection:false}
  for (let i = 0; i < data.length; i++) {
    if (data[i].includes("redirect")) {
      value = value + `navigate(\`/${takeValue(data[i])[1]}/\${@pass@}\`)\n`
    }
    else if (data[i].includes("showsection") || data[i].includes("hidesection")) {
      state2[takeValue(data[i])[1][0].toUpperCase()+ takeValue(data[i])[1].slice(1) + "State"] = v[takeValue(data[i])[0]] 
    }
    else if (data[i].includes("passparam")) {
      value=value.replace("@pass@",takeValue(data[i])[1])
    }
  }
  if (Object.keys(state2).length !==0) { 
    value=value+`setSection(${JSON.stringify(state2)})`
  }

  return value
}

module.exports = { createFile, readFile, replaceGen, replaceRep, regexFun,getLogic }
