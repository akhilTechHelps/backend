var fs = require("fs")
let v = "property"
let r = "rule1"
let s1 = "authority=join(o1,authority).from(authority).select(*).pipe[where(eq(authority:propertyId,o1:_id))]"
let s = "o1=from(property).select(*).where(property:_id,var:var1)"
let s2 = "maps=join(o1,maps).from(maps).select(*).pipe[where(eq(maps:propertyId,o1:_id))]"
let s3 =
  "output=join(o1,leads).from(leads).select(cheque,buildup,comments).pipe[where(leads:pid,o1:_id);isTagged=join(lead,tags).from(tags).select(*).pipe[where(tags:typeToId,lead:_id);where(tags:typeFormId,var:var2)];createdBy=join(lead,users).from(users).select(name).pipe[where(users:_id,lead:salesUserID)]]"
let e = true
let map = [r, v, s, s1, s2, s3]

let csv = {}

csv[r] = {
  table: v,
  exposed: e,
}

const extractvalue = (v) => {
  return v.split(/[()]/)[1]
}
const countSemicoma = (data) => {
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

  return ans
}

const look = (data) => {
  data = [data.slice(0, data.indexOf(".pipe")), data.slice(data.indexOf("[") + 1, data.lastIndexOf("]"))]
  data[0] = data[0].split(".")
  data[0].push(data[1])
  data = data[0]

  let lookupConfig = {
    join: extractvalue(data[0]).split(","),
    from: extractvalue(data[1]),
    select: data[2].includes("*") ? extractvalue(data[2]) : extractvalue(data[2]).split(","),
    pipe: [],
  }
  if (data[3]) {
    if (data[3].includes("pipe")) {
      data = countSemicoma(data[3].trim())
      for (let i = 0; i < data.length; i++) {
        if (data[i].includes("join")) {
          data = [data[i].slice(0, data[i].indexOf("=")), data[i].slice(data[i].indexOf("=") + 1)]
          let k = {}
          k[data[0]] = look(data[1])
          lookupConfig.pipe.push(k)
        } else {
          lookupConfig.pipe.push(mat(data[i]))
        }
      }
    } else {
      data = data[3].split(";")
      for (let i = 0; i < data.length; i++) {
        lookupConfig.pipe.push(mat(data[i]))
      }
    }
  }
  return lookupConfig
}

const mat = (data) => {
  if (data.includes("eq")) {
    data = data.slice(data.indexOf("eq"), data.lastIndexOf(")"))
    return { where: { eq: extractvalue(data).split(",") } }
  } else {
    return { where: extractvalue(data).split(",") }
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

for (let i = 2; i < map.length; i++) {
  if (map[i].includes("join")) {
    data = [map[i].slice(0, map[i].indexOf("=")), map[i].slice(map[i].indexOf("=") + 1)]
    csv[map[0]][data[0]] = look(data[1])
  } else {
    data = map[i].split("=")
    csv[map[0]][data[0]] = mat(data[1].split(".")[2])
  }
}

console.log(createFile(JSON.stringify(csv), "om.json"))
