import random from 'randomstring';

// 随机生成字符串
// length number
// charset 'hex' | 'base64' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric'
const randomStr = (
  length = 4,
  charset = 'alphabetic',
  capitalization = 'lowercase'
) => {
  return random.generate({ length, charset, capitalization });
};

const names = ['shop', 'tab', 'list', 'tips', 'guild', 'service', 'hot', 'news', 'nav', 'job', 'detail', 'about', 'menu', 'vote', 'courses', 'page', 'cantact', 'blog', 'home'];
const randomName = () => {
  let result = names[Math.floor(Math.random() * names.length)];
  let num = randomStr(3, 'numeric');
  return `${result}-${num}`;
};

export { randomStr, randomName };
