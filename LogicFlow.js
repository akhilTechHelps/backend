const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

async function callDB(rule, params) {
  // Add your database call logic here
  console.log(`Called DB with rule: ${rule} and params:`, params);
  return { rule, params }; // Sample return value
}

async function callAPI(api, params) {
  // Add your API call logic here
  console.log(`Called API with api: ${api} and params:`, params);
  return { api, params }; // Sample return value
}

async function processOperations() {
  const results = {};
  for (let i = 0; i < config.operations.length; i++) {
    const operation = config.operations[i];
    if (operation.type === 'db') {
      results[`o${i + 1}`] = await callDB(operation.rule, operation.params);
    } else if (operation.type === 'api') {
      const params = {};
      for (const [key, value] of Object.entries(operation.params)) {
        const [objKey, objValue] = value.split('.');
        params[key] = results[objKey][objValue];
      }
      results[`o${i + 1}`] = await callAPI(operation.api, params);
    }
  }
  console.log('Final results:', results);
}

processOperations();