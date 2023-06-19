"use strict";

var _txt;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var varArr = [];

var fs = require("fs"); // if(var:var3 !== "admin" ? where(or(in(lead:salesUserID,[var:var4,var:var5]).eq(var:var6,var:var7).in(createdByID,[var:var8,var:var9])))/where() )


var v = "property";
var r = "rule1";
var s1 = "authority=join(o1,authority).from(authority).select(*).pipe[where(eq(authority:propertyId,o1:_id))]";
var s = "o1=from(property).select(*).where(property:_id,var:var1)";
var s2 = "maps=join(o1,maps).from(maps).select(*).pipe[where(eq(maps:propertyId,o1:_id))]";
var s3 = "output=join(o1,leads).from(leads).select(cheque,buildup,comments).pipe[where(eq(leads:pid,o1:_id));isTagged=join(lead,tags).from(tags).select(*).pipe[where(eq(tags:typeToId,lead:_id));where(eq(tags:typeFormId,var:var2))];createdBy=join(lead,users).from(users).select(name).pipe[where(users:_id,lead:salesUserID)]]";
var map = [r, v, s, s1, s2, s3];
var txt = ' const fun = async (varArr) => { const modelCollection = mongo.collection("modelname");\nconst modelData = await modelCollection\n  .aggregate([\n      {@},\n      @rep@\n    ])\n    .toArray();\n\n  return {\n    collectionName: "modelname",\n    ...modelData,\n  }};';
txt = txt.replaceAll("modelname", v);
txt = txt.replaceAll("fun", r);
var csv = {};
var countLetVar = 1;

var createFile = function createFile(obj, name) {
  return regeneratorRuntime.async(function createFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          fs.writeFileSync(name, obj);
          return _context.abrupt("return", true);

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", _context.t0.message);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

var extractvalue = function extractvalue(v) {
  return v.split(/[()]/)[1];
};

var mat = function mat(matData) {
  if (matData.includes("eq", "in")) {
    var st = "{ $match: {$expr: { eq: [from,to] }} }";
    matData = matData.slice(matData.indexOf("eq"), matData.lastIndexOf(")"));
    values = extractvalue(matData).split(/[:,]/);
    st = st.replace("from", "$" + values[1]);

    if (values[2].trim() === "var") {
      varArr.push(values[3].trim());
      st = st.replace("to", values[3]);
      return [st, false];
    } else {
      st = st.replace("to", "$/$let" + countLetVar);
      return [st, values[3].trim()];
    }
  } else {
    var _st = "{$match: {from :ObjectId(to)} }";
    values = extractvalue(matData).split(/[:,]/);
    _st = _st.replace("from", values[1]);

    if (values[2].trim() === "var") {
      varArr.push(values[3].trim());
      _st = _st.replace("to", values[3]);
      return [_st, false];
    } else {
      _st = _st.replace("to", "$/$let" + countLetVar);
      return [_st, values[3].trim()];
    }
  }
};

var countSemicoma = function countSemicoma(data) {
  var ans = [];
  var count = 0;
  var prev = 0;

  for (var i = 0; i < data.length; i++) {
    if (data[i] === "[") {
      count++;
    }

    if (data[i] === "]") {
      count--;
    }

    if (data[i] === ";" && count === 0) {
      ans.push(data.slice(prev, i));
      prev = i + 1;
    }
  }

  ans.push(data.slice(prev));
  return ans;
};

var look = function look(lookData, name) {
  lookData = [lookData.slice(0, lookData.indexOf(".pipe")), lookData.slice(lookData.indexOf("[") + 1, lookData.lastIndexOf("]"))];
  lookData[0] = lookData[0].split(".");
  lookData[0].push(lookData[1]);
  lookData = lookData[0];
  var st = '{$lookup:{from: "from_model", let: { letlvalue : $letrvalue}, pipeline : [@l@,@repl@], as : "asValue" }}';
  st = st.replaceAll("asValue", name);
  st = st.replaceAll("from_model", extractvalue(lookData[1]));
  ans = [];

  if (lookData[3].includes("pipe")) {
    dataArr = countSemicoma(lookData[3].trim());

    for (var i = 0; i < dataArr.length; i++) {
      if (dataArr[i].includes("join")) {
        dataForArr = [dataArr[i].slice(0, dataArr[i].indexOf("=")), dataArr[i].slice(dataArr[i].indexOf("=") + 1)];
        st = st.replaceAll("@l@", look(dataForArr[1], dataForArr[0]));
        st = st.replaceAll("@repl@", "@l@,@repl@");
      } else if (dataArr[i].includes("if")) {
        dataForArr = [dataArr[i].slice(0, dataArr[i].indexOf("=")), dataArr[i].slice(dataArr[i].indexOf("=") + 1)];
      } else {
        res = mat(dataArr[i]);
        st = st.replaceAll("@l@", res[0]);
        st = st.replaceAll("@repl@", "@l@,@repl@");

        if (res[1]) {
          st = st.replaceAll("letlvalue", "let" + countLetVar);
          st = st.replaceAll("letrvalue", res[1]);
          countLetVar = countLetVar + 1;
        }
      }
    }
  } else {
    dataElse = lookData[3].split(";");

    for (var _i = 0; _i < dataElse.length; _i++) {
      res = mat(dataElse[_i]);
      st = st.replaceAll("@l@", res[0]);
      st = st.replaceAll("@repl@", "@l@,@repl@");

      if (res[1]) {
        st = st.replaceAll("letlvalue", "let" + countLetVar);
        st = st.replaceAll("letrvalue", res[1]);
        countLetVar = countLetVar + 1;
      }
    }
  }

  if (extractvalue(lookData[2]) !== "*") {
    var slt = "{ $project :{ @p@,@repp@}}";
    var sltArr = extractvalue(lookData[2]).split(",");

    for (var _i2 = 0; _i2 < sltArr.length; _i2++) {
      var k = "from:1";
      slt = slt.replace("@p@", k.replace("from", sltArr[_i2]));
      slt = slt.replace("@repp@", "@p@,@repp@");
    }

    slt = slt.replace("@p@,@repp@", "");
    st = st.replaceAll("@l@", slt);
    st = st.replaceAll("@repl@", "@l@,@repl@");
  }

  st = st.replaceAll("@l@,@repl@", "");
  return st;
};

for (var i = 2; i < map.length; i++) {
  if (map[i].includes("join")) {
    data = [map[i].slice(0, map[i].indexOf("=")), map[i].slice(map[i].indexOf("=") + 1)];
    ot = look(data[1], data[0]);
    txt = txt.replaceAll("{@}", ot);
    txt = txt.replaceAll("@rep@", "{@},@rep@");
  } else {
    data = map[i].split("=");
    ot = mat(data[1].split(".")[2]);
    txt = txt.replaceAll("{@}", ot[0]);
    txt = txt.replaceAll("@rep@", "{@},@rep@");
  }
}

txt = (_txt = txt).replaceAll.apply(_txt, ["varArr"].concat(_toConsumableArray(new Set(varArr))));
txt = txt.replaceAll("{@},@rep@", "");
txt = txt.replaceAll("$/$", "$$$$");
createFile(txt, "query.js");