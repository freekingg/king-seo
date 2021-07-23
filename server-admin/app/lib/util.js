import { toSafeInteger, get, isInteger } from "lodash";
import { ParametersException, config } from "lin-mizar";
const fs = require("fs-extra");
const path = require("path");
import readline from "readline";
import { RSA_X931_PADDING } from "constants";

function getSafeParamId(ctx) {
  const id = toSafeInteger(get(ctx.params, "id"));
  if (!isInteger(id)) {
    throw new ParametersException({
      code: 10030,
    });
  }
  return id;
}

function isOptional(val) {
  // undefined , null , ""  , "    ", 皆通过
  if (val === undefined) {
    return true;
  }
  if (val === null) {
    return true;
  }
  if (typeof val === "string") {
    return val === "" || val.trim() === "";
  }
  return false;
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 *
 * @param {*} url
 */
function delFile(url) {
  let files = [];
  /**
   * 判断给定的路径是否存在
   */
  if (fs.existsSync(url)) {
    /**
     * 返回文件和子目录的数组
     */
    files = fs.readdirSync(url);
    files.forEach(function(file, index) {
      const curPath = path.join(url, file);
      console.log(curPath);
      /**
       * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
       */
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        delFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    /**
     * 清除文件夹
     */
    fs.rmdirSync(url);
  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
}

/* 判断文件是否存在的函数
 *@path_way, 文件路径
 */
function isFileExisted(path_way) {
  return new Promise((resolve, reject) => {
    fs.access(path_way, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function isDirectory(curPath) {
  if (fs.statSync(curPath).isDirectory()) {
    return true;
  } else {
    return false;
  }
}

// 判断是否为html文件
function isHtml(curPath) {
  let ext = path.extname(curPath);
  if (fs.statSync(curPath).isFile() && ext === ".html") {
    return true;
  } else {
    return false;
  }
}

const space2Array = (data) => {
  let oparray = [];
  let res = data;
  res = res.replace(/^\n*/, "");
  res = res.replace(/\n{2,}/g, "\n");
  res = res.replace(/\n*$/, "");
  oparray = res.split("\n");
  return oparray;
};

// 读取文件
function readLineFile(path, lineNum = 0) {
  let n = 0;
  let content = "";
  return new Promise((resolve) => {
    let input = fs.createReadStream(path);
    const rl = readline.createInterface({
      input: input,
    });
    rl.on("line", (line) => {
      n++;
      content += `${line} \n`;
      if (lineNum && n >= lineNum) {
        rl.close();
        input.destroy();
        rl.removeAllListeners();
      }
    });
    rl.on("close", (line) => {
      console.log("读取完毕！");
      resolve(content);
    });
  });
}

// 返回随机数字
const randomA2B = (min, max, int) => {
  let result = Math.random() * (max - min) + min;
  return int ? Math.floor(result) : result;
};

// 返回随机行
const randomKey = (path, num = 1) => {
  return new Promise((resolve) => {
    let rawData = fs.readFileSync(path);
    let lines = rawData.toString().split("\n");
    let data = [];
    for (let index = 0; index < num; index++) {
      let randLineNum = Math.floor(Math.random() * lines.length);

      let line = lines[randLineNum];
      // 去除换行，空格
      line = line.replace(/<\/?.+?>/g, "");
      line = line.replace(/[\r\n]/g, "");
      data.push(line);
    }
    resolve(data);
  });
};

function left_zero_4(str) {
  if (str != null && str != "" && str != "undefined") {
    if (str.length == 2) {
      return "00" + str;
    }
  }
  return str;
}

let Unicode = (str)=> {
  var a = [],
    i = 0;
  for (; i < str.length; ) a[i] = str.charCodeAt(i++);
  return "&#" + a.join(";&#") + ";";
};

export {
  getSafeParamId,
  isOptional,
  mkdirsSync,
  delFile,
  isDirectory,
  isHtml,
  randomA2B,
  isFileExisted,
  readLineFile,
  space2Array,
  randomKey,
  Unicode,
};
