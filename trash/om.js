const varArr = []
var fs = require("fs")
// if(var:var3 !== "admin" ? where(or(in(lead:salesUserID,[var:var4,var:var5]).eq(var:var6,var:var7).in(createdByID,[var:var8,var:var9])))/where() )
let v = "property"
let r = "rule1"
let s1 = "authority=join(o1,authority).from(authority).select(*).pipe[where(eq(authority:propertyId,o1:_id))]"
let s = "o1=from(property).select(*).where(property:_id,var:var1)"
let s2 = "maps=join(o1,maps).from(maps).select(*).pipe[where(eq(maps:propertyId,o1:_id))]"
let s3 =
  "output=join(o1,leads).from(leads).select(cheque,buildup,comments).pipe[where(eq(leads:pid,o1:_id));isTagged=join(lead,tags).from(tags).select(*).pipe[where(eq(tags:typeToId,lead:_id));where(eq(tags:typeFormId,var:var2))];createdBy=join(lead,users).from(users).select(name).pipe[where(users:_id,lead:salesUserID)]]"
let map = [r, v, s, s1, s2, s3]

let txt =
  ' const fun = async (varArr) => { const modelCollection = mongo.collection("modelname");\nconst modelData = await modelCollection\n  .aggregate([\n      {@},\n      @rep@\n    ])\n    .toArray();\n\n  return {\n    collectionName: "modelname",\n    ...modelData,\n  }};'

txt = txt.replaceAll("modelname", v)
txt = txt.replaceAll("fun", r)
let csv = {}
let countLetVar = 1
const createFile = async (obj, name) => {
  try {
    fs.writeFileSync(name, obj)
    return true
  } catch (e) {
    return e.message
  }
}
const extractvalue = (v) => {
  return v.split(/[()]/)[1]
}
// extractvalue(data).split(",")
const mat = (matData) => {
  if (matData.includes("eq", "in")) {
    let st = "{ $match: {$expr: { eq: [from,to] }} }"
    matData = matData.slice(matData.indexOf("eq"), matData.lastIndexOf(")"))
    values = extractvalue(matData).split(/[:,]/)
    st = st.replace("from", "$" + values[1])
    if (values[2].trim() === "var") {
      varArr.push(values[3].trim())
      st = st.replace("to", values[3])
      return [st, false]
    } else {
      st = st.replace("to", "$/$let" + countLetVar)
      return [st, values[3].trim()]
    }
  } else {
    let st = "{$match: {from :ObjectId(to)} }"
    values = extractvalue(matData).split(/[:,]/)
    st = st.replace("from", values[1])

    if (values[2].trim() === "var") {
      varArr.push(values[3].trim())
      st = st.replace("to", values[3])
      return [st, false]
    } else {
      st = st.replace("to", "$/$let" + countLetVar)
      return [st, values[3].trim()]
    }
  }
}

const countSemicoma = (data) => {
  console.log(data, 55)
  let ans = []
  let doCount = true
  let count = 0
  let prev = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i] === "[") {
      count = count + 1
      doCount = false
    }
    if (data[i] === "]") {
      count = count - 1
      if (count === 0) {
        doCount = true
      }
    }
    if (data[i] === ";" && doCount) {
      ans.push(data.slice(prev, i))
      prev = i + 1
    }
  }
  ans.push(data.slice(prev))
  console.log(ans, 77)
  return ans
}

const look = (lookData, name) => {
  lookData = [lookData.slice(0, lookData.indexOf(".pipe")), lookData.slice(lookData.indexOf("[") + 1, lookData.lastIndexOf("]"))]
  lookData[0] = lookData[0].split(".")
  lookData[0].push(lookData[1])
  lookData = lookData[0]

  let st = '{$lookup:{from: "from_model", let: { letlvalue : $letrvalue}, pipeline : [@l@,@repl@], as : "asValue" }}'
  st = st.replaceAll("asValue", name)
  st = st.replaceAll("from_model", extractvalue(lookData[1]))

  ans = []
  if (lookData[3].includes("pipe")) {
    dataArr = countSemicoma(lookData[3].trim())

    for (let i = 0; i < dataArr.length; i++) {
      if (dataArr[i].includes("join")) {
        dataForArr = [dataArr[i].slice(0, dataArr[i].indexOf("=")), dataArr[i].slice(dataArr[i].indexOf("=") + 1)]
        st = st.replaceAll("@l@", look(dataForArr[1], dataForArr[0]))
        st = st.replaceAll("@repl@", "@l@,@repl@")
      } else if (dataArr[i].includes("if")) {
        dataForArr = [dataArr[i].slice(0, dataArr[i].indexOf("=")), dataArr[i].slice(dataArr[i].indexOf("=") + 1)]
      } else {
        res = mat(dataArr[i])
        st = st.replaceAll("@l@", res[0])
        st = st.replaceAll("@repl@", "@l@,@repl@")
        if (res[1]) {
          st = st.replaceAll("letlvalue", "let" + countLetVar)
          st = st.replaceAll("letrvalue", res[1])
          countLetVar = countLetVar + 1
        }
      }
    }
  } else {
    dataElse = lookData[3].split(";")
    for (let i = 0; i < dataElse.length; i++) {
      res = mat(dataElse[i])
      st = st.replaceAll("@l@", res[0])
      st = st.replaceAll("@repl@", "@l@,@repl@")
      if (res[1]) {
        st = st.replaceAll("letlvalue", "let" + countLetVar)
        st = st.replaceAll("letrvalue", res[1])
        countLetVar = countLetVar + 1
      }
    }
  }

  if (extractvalue(lookData[2]) !== "*") {
    let slt = "{ $project :{ @p@,@repp@}}"
    let sltArr = extractvalue(lookData[2]).split(",")
    for (let i = 0; i < sltArr.length; i++) {
      let k = "from:1"
      slt = slt.replace("@p@", k.replace("from", sltArr[i]))
      slt = slt.replace("@repp@", "@p@,@repp@")
    }
    slt = slt.replace("@p@,@repp@", "")
    st = st.replaceAll("@l@", slt)
    st = st.replaceAll("@repl@", "@l@,@repl@")
  }
  st = st.replaceAll("@l@,@repl@", "")
  return st
}

for (let i = 2; i < map.length; i++) {
  if (map[i].includes("join")) {
    data = [map[i].slice(0, map[i].indexOf("=")), map[i].slice(map[i].indexOf("=") + 1)]
    ot = look(data[1], data[0])
    txt = txt.replaceAll("{@}", ot)
    txt = txt.replaceAll("@rep@", "{@},@rep@")
  } else {
    data = map[i].split("=")
    ot = mat(data[1].split(".")[2])
    txt = txt.replaceAll("{@}", ot[0])
    txt = txt.replaceAll("@rep@", "{@},@rep@")
  }
}

txt = txt.replaceAll("varArr", ...new Set(varArr))
txt = txt.replaceAll("{@},@rep@", "")
txt = txt.replaceAll("$/$", "$$$$")

createFile(txt, "query.js")
