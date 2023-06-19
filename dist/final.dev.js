"use strict";

var _require = require("google-spreadsheet"),
    GoogleSpreadsheet = _require.GoogleSpreadsheet;

var creds = require("./pass.json"); // the file saved above


var shell = require('shelljs');

var fs = require('fs');

var templater = require("./templater");

var path = require('path');

var getAuth = function getAuth(id) {
  var doc;
  return regeneratorRuntime.async(function getAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // https://docs.google.com/spreadsheets/d/1JeRyGLrCBYbGQ1lAAE7lnuozB3eJQONL-5a_06rb4qQ/edit?usp=sharing
          doc = new GoogleSpreadsheet(id);
          _context.next = 4;
          return regeneratorRuntime.awrap(doc.useServiceAccountAuth(creds));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(doc.loadInfo());

        case 6:
          return _context.abrupt("return", doc);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", _context.t0.message);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var createFile = function createFile(obj, name, path) {
  return regeneratorRuntime.async(function createFile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!path) {
            _context2.next = 7;
            break;
          }

          fs.mkdirSync(path, {
            recursive: true
          });
          fs.writeFileSync(path + name, obj);
          return _context2.abrupt("return", true);

        case 7:
          fs.writeFileSync(name, obj);
          return _context2.abrupt("return", true);

        case 9:
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", _context2.t0.message);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var readFile = function readFile(name) {
  var data;
  return regeneratorRuntime.async(function readFile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          data = fs.readFileSync(name, "utf8");
          return _context3.abrupt("return", data);

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

function copyFile(sourcePath, destPath) {
  var absSourcePath, absDestPath, destDir;
  return regeneratorRuntime.async(function copyFile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Get absolute paths
          absSourcePath = path.resolve(sourcePath);
          absDestPath = path.resolve(destPath); // Create destination directory if it doesn't exist

          destDir = path.dirname(absDestPath);

          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, {
              recursive: true
            });
          } // Copy file to destination


          fs.copyFileSync(absSourcePath, absDestPath);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}

var modelIf = function modelIf(txt1, header, rows) {
  var s, k, s2, t, s1, _s;

  return regeneratorRuntime.async(function modelIf$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!txt1.includes("@if".concat(header, "con"))) {
            _context5.next = 24;
            break;
          }

          s = new RegExp("@if".concat(header, "con.*@if").concat(header, "con"), "gm");
          k = txt1.match(s)[0];
          k = k.replaceAll("@if".concat(header, "con"), "").trim();
          kArr = k.split(";");

          if (!kArr.includes(rows[header])) {
            _context5.next = 18;
            break;
          }

          txt1 = txt1.replaceAll(s, "");
          txt1 = txt1.replaceAll("@".concat(header), "");
          s2 = new RegExp("@if".concat(header, "true.*@if").concat(header, "true"), "gm");
          t = txt1.match(s2)[0];
          t = t.replaceAll("@if".concat(header, "true"), "").trim();
          tArr = t.split(";");
          txt1 = txt1.replaceAll(s2, tArr[kArr.indexOf(rows[header])]);
          s1 = new RegExp("@if".concat(header, "false.*@if").concat(header, "false"), "gm");
          txt1 = txt1.replaceAll(s1, "");
          return _context5.abrupt("return", [true, txt1]);

        case 18:
          txt1 = txt1.replaceAll(s, "");
          txt1 = txt1.replaceAll("@".concat(header), "");
          txt1 = txt1.replaceAll("@if".concat(header, "false"), "");
          _s = new RegExp("@if".concat(header, "true.*@if").concat(header, "true"), "gm");
          txt1 = txt1.replaceAll(_s, "");
          return _context5.abrupt("return", [false, txt1]);

        case 24:
          return _context5.abrupt("return", [false, txt1]);

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var gen = function gen(rows, header) {
  var modelNames, planetxt, struct, txt, currentModelName, currentModelIndex, i, j, op, s;
  return regeneratorRuntime.async(function gen$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          modelNames = [];
          _context6.next = 3;
          return regeneratorRuntime.awrap(readFile("./template/model.txt"));

        case 3:
          planetxt = _context6.sent;
          struct = planetxt.match(/\[\[.*\]\]/gm)[0];
          txt = planetxt;
          txt = txt.replaceAll("[[", "");
          txt = txt.replaceAll("]]", "");
          struct = struct.replaceAll("[[", "");
          struct = struct.replaceAll("]]", "");
          currentModelName = rows[0].model_name;
          currentModelIndex = 0;
          i = 0;

        case 13:
          if (!(i < rows.length)) {
            _context6.next = 41;
            break;
          }

          if (!(rows[i].model_name != currentModelName)) {
            _context6.next = 27;
            break;
          }

          txt = txt.replaceAll("".concat(struct, "@rep@"), "");
          txt = txt.replaceAll(/model_name/gm, rows[currentModelIndex].model_name);
          _context6.next = 19;
          return regeneratorRuntime.awrap(createFile(txt, "".concat(rows[currentModelIndex].model_name, "Model.js"), "./myapp/models/"));

        case 19:
          modelNames.push(rows[currentModelIndex].model_name);
          currentModelName = rows[i].model_name;
          currentModelIndex = i;
          txt = planetxt;
          txt = txt.replaceAll("[[", "");
          txt = txt.replaceAll("]]", "");
          struct = struct.replaceAll("[[", "");
          struct = struct.replaceAll("]]", "");

        case 27:
          j = 0;

        case 28:
          if (!(j < header.length)) {
            _context6.next = 37;
            break;
          }

          _context6.next = 31;
          return regeneratorRuntime.awrap(modelIf(txt, header[j], rows[i]));

        case 31:
          op = _context6.sent;
          txt = op[1];

          if (!op[0]) {
            if (rows[i][header[j]] === "n") {
              s = new RegExp("@".concat(header[j], ".*@").concat(header[j]), "gm");
              txt = txt.replace(s, "");
            } else {
              txt = txt.replaceAll("@".concat(header[j]), "");

              if (rows[i][header[j]] === "y") {
                txt = txt.replaceAll("".concat(header[j], "value"), true);
              } else {
                txt = txt.replaceAll("".concat(header[j], "value"), rows[i][header[j]]);
              }
            }
          }

        case 34:
          j++;
          _context6.next = 28;
          break;

        case 37:
          txt = txt.replace("@rep@", "".concat(struct, "@rep@"));

        case 38:
          i++;
          _context6.next = 13;
          break;

        case 41:
          txt = txt.replaceAll("".concat(struct, "@rep@"), "");
          txt = txt.replaceAll(/model_name/gm, "".concat(rows[currentModelIndex].model_name));
          _context6.next = 45;
          return regeneratorRuntime.awrap(createFile(txt, "".concat(rows[currentModelIndex].model_name, "Model.js"), "./myapp/models/"));

        case 45:
          modelNames.push(rows[currentModelIndex].model_name);
          return _context6.abrupt("return", modelNames);

        case 47:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var main = function main() {
  var doc, sheet, rows, v, sheetData, i, routetxt, controllertxt, _routetxt, _controllertxt;

  return regeneratorRuntime.async(function main$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(getAuth("1qCwrCW8v6hDHPWuvwGsZrUgDrV41or7AQWsgWADCyoo"));

        case 2:
          doc = _context7.sent;
          sheet = doc.sheetsByTitle["gymApp"];
          _context7.next = 6;
          return regeneratorRuntime.awrap(sheet.getRows());

        case 6:
          rows = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(gen(rows, sheet.headerValues));

        case 9:
          v = _context7.sent;
          sheetData = require("./data.json");
          templater(sheetData, "./template/server.hbs", "server.js", "./myapp/");
          templater(sheetData, "./template/package.hbs", "package.json", "./myapp/");
          i = 0;

        case 14:
          if (!(i < v.length)) {
            _context7.next = 45;
            break;
          }

          if (!(v[i] === "users")) {
            _context7.next = 30;
            break;
          }

          _context7.next = 18;
          return regeneratorRuntime.awrap(readFile("./template/userRoute.txt"));

        case 18:
          routetxt = _context7.sent;
          _context7.next = 21;
          return regeneratorRuntime.awrap(readFile("./template/userController.txt"));

        case 21:
          controllertxt = _context7.sent;
          routetxt = routetxt.replaceAll(/model_name/gm, "".concat(v[i]));
          _context7.next = 25;
          return regeneratorRuntime.awrap(createFile(routetxt, "/".concat(v[i], "Route.js"), "./myapp/routes"));

        case 25:
          controllertxt = controllertxt.replaceAll(/model_name/gm, "".concat(v[i]));
          _context7.next = 28;
          return regeneratorRuntime.awrap(createFile(controllertxt, "".concat(v[i], "Controller.js"), "./myapp/controller/"));

        case 28:
          _context7.next = 42;
          break;

        case 30:
          _context7.next = 32;
          return regeneratorRuntime.awrap(readFile("./template/route.txt"));

        case 32:
          _routetxt = _context7.sent;
          _context7.next = 35;
          return regeneratorRuntime.awrap(readFile("./template/controller.txt"));

        case 35:
          _controllertxt = _context7.sent;
          _routetxt = _routetxt.replaceAll(/model_name/gm, "".concat(v[i]));
          _context7.next = 39;
          return regeneratorRuntime.awrap(createFile(_routetxt, "".concat(v[i], "Route.js"), "./myapp/routes/"));

        case 39:
          _controllertxt = _controllertxt.replaceAll(/model_name/gm, "".concat(v[i]));
          _context7.next = 42;
          return regeneratorRuntime.awrap(createFile(_controllertxt, "".concat(v[i], "Controller.js"), "./myapp/controller/"));

        case 42:
          i++;
          _context7.next = 14;
          break;

        case 45:
          _context7.next = 47;
          return regeneratorRuntime.awrap(copyFile("./template/uploader.txt", "./myapp/middleware/uploader.js"));

        case 47:
          fs.copyFileSync("./template/validator.txt", "./myapp/models/validator.js");
          fs.copyFileSync("./template/mastersController.txt", "./myapp/controller/masterController.js");
          fs.copyFileSync("./template/masterRoute.txt", "./myapp/routes/masterRoute.js");
          shell.cd("myapp");
          shell.exec("npm i");

        case 52:
        case "end":
          return _context7.stop();
      }
    }
  });
};

main();