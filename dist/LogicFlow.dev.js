"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

function callDB(rule, params) {
  return regeneratorRuntime.async(function callDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Add your database call logic here
          console.log("Called DB with rule: ".concat(rule, " and params:"), params);
          return _context.abrupt("return", {
            rule: rule,
            params: params
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

function callAPI(api, params) {
  return regeneratorRuntime.async(function callAPI$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Add your API call logic here
          console.log("Called API with api: ".concat(api, " and params:"), params);
          return _context2.abrupt("return", {
            api: api,
            params: params
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function processOperations() {
  var results, i, operation, params, _i, _Object$entries, _Object$entries$_i, key, value, _value$split, _value$split2, objKey, objValue;

  return regeneratorRuntime.async(function processOperations$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          results = {};
          i = 0;

        case 2:
          if (!(i < config.operations.length)) {
            _context3.next = 19;
            break;
          }

          operation = config.operations[i];

          if (!(operation.type === 'db')) {
            _context3.next = 10;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(callDB(operation.rule, operation.params));

        case 7:
          results["o".concat(i + 1)] = _context3.sent;
          _context3.next = 16;
          break;

        case 10:
          if (!(operation.type === 'api')) {
            _context3.next = 16;
            break;
          }

          params = {};

          for (_i = 0, _Object$entries = Object.entries(operation.params); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
            _value$split = value.split('.'), _value$split2 = _slicedToArray(_value$split, 2), objKey = _value$split2[0], objValue = _value$split2[1];
            params[key] = results[objKey][objValue];
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(callAPI(operation.api, params));

        case 15:
          results["o".concat(i + 1)] = _context3.sent;

        case 16:
          i++;
          _context3.next = 2;
          break;

        case 19:
          console.log('Final results:', results);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  });
}

processOperations();