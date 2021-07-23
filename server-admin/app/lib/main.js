// 返回随机数字
const randomKey = (path) => {
  return new Promise((resolve) => {
    let rawData = fs.readFileSync(path)
    let lines = rawData.toString().split('\n')
    let randLineNum = Math.floor(Math.random() * lines.length);
    resolve(lines[randLineNum])
  })
};


export {
  
  randomKey
};
