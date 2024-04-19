import { isObj } from './type';

// 使用方法同 classnames，将参数中的字符串和对象中 value 为 true 值的 key 加入到 class 中
export default function classnames(...params: Array<string | Obj | undefined>) {
  let cls = '';
  params.forEach((param) => {
    if (param) {
      if (typeof param === 'string' && param) cls += ` ${param}`;
      else if (isObj(param)) {
        Object.keys(param).forEach((k) => {
          const v = param[k];
          if (v) cls += ` ${k}`;
        });
      }
    }
  });
  return cls.trim();
}
