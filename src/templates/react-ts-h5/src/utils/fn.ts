type Fn = (...args: any[]) => any;

export const throttle = (fn: Fn, wait = 300) => {
  let timer: any = true;
  return (...args: any[]) => {
    if (timer) {
      timer = false;
      fn.apply(this, args);
      setTimeout(() => {
        timer = true;
      }, wait);
    }
  };
};

export const debounce = (fn: Fn, wait = 300) => {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};
