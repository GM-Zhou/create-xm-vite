import CryptoJS from 'crypto-js';

// import { cookie } from './storage';
// import { getExpireTime } from './time';

/**
 * 生成指定长度的随机字符串
 * @param {number} len - 需要生成的字符串长度
 * @returns {string} - 生成的随机字符串
 */
export const getRandom = (len: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// /**
//  * 获取UUID，如果不存在则生成并设置到cookie
//  * @returns {string} - UUID字符串
//  */
// const getUUID = () => {
//   let uuid = cookie.getParam('_xmLog');
//   if (!uuid) {
//     uuid = getRandom(6);
//     cookie.setParam('_xmLog', uuid, getExpireTime(3600 * 24 * 365));
//   }
//   return uuid.replace(/&/g, '_');
// };

/**
 * 对JSON对象进行键名排序并生成参数字符串
 * @param {Obj} jsonObj - JSON对象
 * @param {boolean} upper - 是否转换为大写字符串，默认为false
 * @returns {string} - 排序后的参数字符串
 */
const jsonSort = (jsonObj: Obj, upper = false) => {
  const arr = Object.keys(jsonObj).sort();
  let str = '';
  arr.forEach((key) => {
    str += `${key}=${jsonObj[key]}&`;
  });
  str = str.slice(0, str.length - 1);
  return upper ? str.toUpperCase() : str;
};

/**
 * 获取参数签名
 * @param {Obj} params - 参数对象
 * @param {string} key - 签名密钥
 * @returns {string} - 参数签名字符串
 */
export const getSig = (params: Obj, key: string) => {
  const signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonSort(params)));
  const sha1ResultBytes = CryptoJS.MD5(CryptoJS.HmacSHA1(signature, key));
  return sha1ResultBytes.toString();
};
