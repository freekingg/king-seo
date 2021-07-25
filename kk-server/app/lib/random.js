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

export default randomStr;
