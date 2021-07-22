import scrape from "website-scraper";
import PuppeteerPlugin from "website-scraper-puppeteer";
import { config } from "lin-mizar";
import { Hmac } from "crypto";
const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");
const { delFile } = require("./util");

class Clone {
  // constructor() {}
  async create ({ domain, targetDomain }) {
    return new Promise((resolve, reject) => {
      // 取第一个域名为文件夹名字
      const name = domain[0];

      // 创建网站文件夹
      const siteDir = path.join(config.getItem("website"), name);
      if (fs.existsSync(siteDir)) {
        delFile(siteDir);
        console.log("存在目标文件夹，先删除");
      }

      const options = {
        urls: targetDomain,
        directory: siteDir,
        ignoreErrors: true,
        request: {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          }
        },
        urlFilter: function (url) {
          let ignore = ['cnzz', 'ce.cn']
          let r = ignore.filter(item => url.indexOf(item) !== -1)
          if (!r.length) {
            return url;
          }
        },
        plugins: [
          new PuppeteerPlugin({
            launchOptions: {
              headless: true,
              defaultViewport: {
                width: 1920,
                height: 1080
              },
              timeout: 60000
            }
          })
        ]
      };

      scrape(options)
        .then((result) => {
         
          const src = path.join(siteDir, 'index.html');
          console.log('克隆完成', src );
          const options = {
            files: src,
            from: [
              /<a([\s]+|[\s]+[^<>]+[\s]+)href=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>/gi,
              /<script([\s]+|[\s]+[^<>]+[\s]+)src=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>/gi,
              /hm.src/gi,
              /cnzz.com/gi,
              /window.open/gi
            ],
            to: (m1) => {
              console.log('m1', m1);
              if (!m1) return;

              if (m1.indexOf('href') !== -1) {
                let reg = /href="[^"]*"/gi;
                let str = m1.replace(reg, 'href="."')
                return str;
              }

              if (m1.indexOf('src') !== -1) {
                let ignoreJs = ['cnzz', '51.la', 'baidu']

                let r = ignoreJs.filter(item => m1.indexOf(item) !== -1)
                console.log('r', r);
                if (r.length) {
                  let reg = /src="[^"]*"/gi;
                  let str = m1.replace(reg, 'src="."')
                  return str;
                }
              }

              if (m1.indexOf('hm.src') !== -1) {
                return 'hm';
              }

              if (m1.indexOf('cnzz.com') !== -1) {
                return '';
              }

              if (m1.indexOf('window.open') !== -1) {
                return '';
              }

              return m1
            }
          };

          replace(options)
            .then((results) => {
              console.log("内容替换完成:", results);
              resolve(true);
            })
            .catch((error) => {
              console.error("内容替换失败:", error);
              reject(false);
            });
        })
        .catch((e) => {
          console.log("网络克隆失败", e);
          reject(false);
        });
    });
  }
}

export default new Clone();
