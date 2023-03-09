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

const om =
  '[[fieldnamevalue : { @iffieldtype @ifconfor_key@ifcon  type : @iftrue Schema.Types.ObjectId  @iftrue   @iffalse fieldtypevalue @iffalse,@iffieldtype @ref ref : refvalue, @ref @require require : [requirevalue,"fieldnamevalue is required " ], @require @min min: minvalue, @min @unique unique :uniquevalue, @unique @max max: maxvalue, @max @regex validate :{ validator : (v) => validator.regexvalueValidator(v), message: props => `${props.value} is not a valid `},@regex},]]'

const k = "@fieldtype @if type : {fieldtypevalue} @if ,@fieldtype"
console.log(k.includes("@if"))
var e = "John Smith"
var message = "Hello, my name is ${e}"
// console.log(new Function("e", "return `" + me,ssage + "`;")(e))

function fun(rows, str, i, text) {
  return eval("`" + str + "`")
}

const main = async () => {
  const doc = await getAuth("1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ")
  const sheet = doc.sheetsByTitle["model"]
  let text = {}
  const rows = await sheet.getRows()
  for (let i = 0; i < rows.length; i++) {
    const k = fun(rows, om, i, text)
    console.log(k)

    text = text + k
  }
}

main()
