/* eslint-disable no-console */
export const xlog = {
  info: (...args: any[]) => {
    console.info(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  debug: (...args: any[]) => {
    console.debug(...args);
  },
};

export const requestErrLog = (url: string, err: any) => {
  xlog.error('request error ->', url);
  xlog.error(err);
};
