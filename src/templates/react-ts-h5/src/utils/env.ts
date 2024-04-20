// ! 不能引用外部函数，避免循环引用

export const ENV = import.meta.env;

export type ENV_MODE_TYPE = 'production' | 'test' | 'local_dev' | 'local_prod';

/** 主要用于 URL 前缀的切换 */
export const ENV_MODE = ENV.MODE as ENV_MODE_TYPE;
