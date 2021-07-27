import axios from 'axios';

let isIp = (str) => {
  let regIp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
  let regIpPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
  if (regIp.test(str) || regIpPort.test(str)) {
    return true;
  } else {
    return false;
  }
};

let isSpider = (header) => {
  let ua = header ? header['user-agent'] : '';
  var regexp = /\.(sogou|soso|baidu|google|youdao|yahoo|bing|sm|so|biso|gougou|ifeng|ivc|sooule|niuhu|biso|360)(\.[a-z0-9\-]+){1,2}\//gi;
  if (regexp.test(ua)) {
    return true;
  } else {
    return false;
  }
};

let spider = async (header) => {
  if (isIp(header.host)) return false;
  let str = header ? header['user-agent'] : '';
  let type = 'pc端';
  let ip = header ? header['x-real-ip'] : '';
  let path = header ? header['x-special-proxy-header-path'] : '';
  let host = header.host;
  let country = '';
  let location = await axios.get(`http://ip-api.com/json/${ip}`);
  if (location.data.status === 'success') {
    country = location.data.country || location.data.city;
  } else {
    country = '火星';
  }
  // let
  if (
    str.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    type = '移动端';
  }

  if (str.indexOf('Googlebot') > 0) {
    return {
      name: '谷歌蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('Baiduspider-render') > 0) {
    return {
      name: '百度渲染蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('Baiduspider-image') > 0) {
    return {
      name: '百度图片蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('Baiduspider') > 0) {
    return {
      name: '百度蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('baidu') > 0) {
    return {
      name: '百度蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('sogou spider') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('SogouSpider') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('sogou web') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('sosospider') > 0) {
    return {
      name: 'SOSO蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('360spider') > 0) {
    return {
      name: '360蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('360Spider') > 0) {
    return {
      name: '360蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('YisouSpider') > 0) {
    return {
      name: '神马蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('bingbot') > 0) {
    return {
      name: '必应蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('BingPreview') > 0) {
    return {
      name: '必应蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('yahoo') > 0) {
    return {
      name: 'yahoo蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('sohu') > 0) {
    return {
      name: 'sohu蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('slurp') > 0) {
    return {
      name: '雅虎蜘蛛',
      type,
      ip,
      path,
      country,
      host
    };
  }
  if (str.indexOf('bot') > 0) {
    return {
      name: '其它bot',
      type,
      ip,
      path,
      country,
      host
    };
  }
  return false;
};

export { spider, isIp, isSpider };
