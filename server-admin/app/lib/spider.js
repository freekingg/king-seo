import axios from 'axios';
let spider = async (header) => {
  let str = header ? header['user-agent'] : '';
  let type = 'pc端';
  let ip = header ? header['x-real-ip'] : '';
  let path = header ? header['x-special-proxy-header-path'] : '';
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

  // www.geoplugin.net/json.gp?ip=

  if (str.indexOf('googlebot') > 0) {
    return {
      name: '谷歌蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('Baiduspider-render') > 0) {
    return {
      name: '百度渲染蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('Baiduspider-image') > 0) {
    return {
      name: '百度图片蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('baiduspider') > 0) {
    return {
      name: '百度蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('baidu') > 0) {
    return {
      name: '百度蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('sogou spider') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('SogouSpider') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('sogou web') > 0) {
    return {
      name: '搜狗蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('sosospider') > 0) {
    return {
      name: 'SOSO蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('360spider') > 0) {
    return {
      name: '360蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('360Spider') > 0) {
    return {
      name: '360蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('YisouSpider') > 0) {
    return {
      name: '神马蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('bingbot') > 0) {
    return {
      name: '必应蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('BingPreview') > 0) {
    return {
      name: '必应蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('yahoo') > 0) {
    return {
      name: 'yahoo蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('sohu') > 0) {
    return {
      name: 'sohu蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('slurp') > 0) {
    return {
      name: '雅虎蜘蛛',
      type,
      ip,
      path,
      country
    };
  }
  if (str.indexOf('bot') > 0) {
    return {
      name: '其它bot',
      type,
      ip,
      path,
      country
    };
  }
  return false;
};

export { spider };
