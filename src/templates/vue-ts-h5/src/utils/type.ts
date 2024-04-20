export const isObj = <T = Obj>(val: unknown): val is T => Object.prototype.toString.call(val) === '[object Object]';
