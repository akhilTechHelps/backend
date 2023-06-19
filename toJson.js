const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require("./pass.json") // the file saved above
var fs = require("fs")
const fileOp = require("./txtOperator")


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
async function convertSheetToJson() {

  const doc = await getAuth("176FCDkjpKiY3ZYOehpCo-VaNaPYQ32zLBNMFxaIilSY")
  const sheet = doc.sheetsByTitle["backend"]// assuming the data is in the first sheet
  const rows = await sheet.getRows();
  const models = {}; // object to hold the models
  const headers = sheet.headerValues

  const headersV = rows[0]._sheetHeader; // assuming first row as header

  rows.forEach(row => {
    const modelName = row._rawData[0]; // assuming 1st column as model_name
    const fieldData = {};

    for (let i = 1; i < headers.length; i++) {
      const fieldHeader = headers[i];
      const fieldValue = row[fieldHeader];
      fieldData[fieldHeader] = fieldValue;
    }

    if (!models[modelName]) {
      models[modelName] = { fields: [] };
    }

    models[modelName].fields.push(fieldData);
  });

  const modelsArray = [];

  for (const [modelName, modelData] of Object.entries(models)) {
    modelsArray.push({ name: modelName, fields: modelData.fields });
  }

  console.log(modelsArray);
  await fileOp.createFile(JSON.stringify({models:modelsArray}), "data.json")

}

convertSheetToJson();
