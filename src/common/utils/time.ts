 /**
  * 将秒转为时分秒格式
  * @param {number} seconds - 输入的秒数
  * @returns {string} - 返回时分秒格式的时间字符串
  */
 export const formatTime = (seconds: number): string => {
   const h = Math.floor(seconds / 3600);
   const m = Math.floor((seconds % 3600) / 60);
   const s = Math.floor(seconds % 60);
   const ms = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
   const hs = `${h.toString().padStart(2, '0')}:`;
   return `${h ? hs : ''}${ms}`;
 };
 
 /**
  * 将10位或13位时间戳转为年月日时分秒格式
  * @param {number} timestamp - 输入的时间戳
  * @returns {string} - 返回年月日时分秒格式的时间字符串
  */
 export const formatDate = (timestamp: number): string => {
   const is10digit = timestamp < 1000000000000;
   const date = new Date(is10digit ? timestamp * 1000 : timestamp);
   const year = date.getFullYear();
   const month = (date.getMonth() + 1).toString().padStart(2, '0');
   const day = date.getDate().toString().padStart(2, '0');
   const hour = date.getHours().toString().padStart(2, '0');
   const minute = date.getMinutes().toString().padStart(2, '0');
   const second = date.getSeconds().toString().padStart(2, '0');
   return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
 };
 
 /**
  * 获取时间戳
  * @param {10 | 13} digit - 时间戳的位数，可选值为 10 或 13，默认为 10
  * @returns {number} - 返回对应位数的时间戳
  */
 export const getTimestamp = (digit: 10 | 13 = 10): number => {
   const now = new Date();
   const timestamp = now.getTime();
   return digit === 10 ? Math.floor(timestamp / 1000) : timestamp;
 };
 
 /**
  * 获取过期时间的时间戳
  * @param {number} seconds - 输入的秒数
  * @returns {number} - 返回过期时间的时间戳
  */
 export const getExpireTime = (seconds: number): number => getTimestamp() + seconds;
