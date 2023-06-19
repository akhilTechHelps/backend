"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rule1 = function rule1(var1) {
  var modelCollection, modelData;
  return regeneratorRuntime.async(function rule1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          modelCollection = mongo.collection("property");
          _context.next = 3;
          return regeneratorRuntime.awrap(modelCollection.aggregate([{
            $match: {
              _id: ObjectId(var1)
            }
          }, {
            $lookup: {
              from: "authority",
              "let": {
                let1: $_id
              },
              pipeline: [{
                $match: {
                  $expr: {
                    eq: [$propertyId, $$let1]
                  }
                }
              }],
              as: "authority"
            }
          }, {
            $lookup: {
              from: "maps",
              "let": {
                let2: $_id
              },
              pipeline: [{
                $match: {
                  $expr: {
                    eq: [$propertyId, $$let2]
                  }
                }
              }],
              as: "maps"
            }
          }, {
            $lookup: {
              from: "leads",
              "let": {
                let3: $_id
              },
              pipeline: [{
                $match: {
                  $expr: {
                    eq: [$pid, $$let3]
                  }
                }
              }, {
                $lookup: {
                  from: "tags",
                  "let": {
                    let4: $_id
                  },
                  pipeline: [{
                    $match: {
                      $expr: {
                        eq: [$typeToId, $$let4]
                      }
                    }
                  }, {
                    $match: {
                      $expr: {
                        eq: [$typeFormId, var2]
                      }
                    }
                  }],
                  as: "isTagged"
                }
              }, {
                $lookup: {
                  from: "users",
                  "let": {
                    let5: $salesUserID
                  },
                  pipeline: [{
                    $match: {
                      _id: ObjectId($$let5)
                    }
                  }, {
                    $project: {
                      name: 1
                    }
                  }],
                  as: "createdBy"
                }
              }, {
                $project: {
                  cheque: 1,
                  buildup: 1,
                  comments: 1
                }
              }],
              as: "output"
            }
          }]).toArray());

        case 3:
          modelData = _context.sent;
          return _context.abrupt("return", _objectSpread({
            collectionName: "property"
          }, modelData));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};