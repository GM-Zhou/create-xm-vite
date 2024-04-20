import { storage } from './storage';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: Obj | FormData;
  timeout?: number;
  cache?: {
    key: string;
    type: 'local' | 'session';
  };
}

/**
 * 发起请求并返回请求结果
 * @template T
 * @param {string} url - 请求的URL
 * @param {FetchOptions} [options] - 请求配置选项
 * @returns {Promise<T>} - 返回一个Promise，resolve为请求结果，reject为请求错误
 */
export const request = async <T = any>(url: string, options?: FetchOptions): Promise<T> => {
  const { timeout = 5000, cache } = options || {};
  // const cacheHandler = cacheKey ? getCacheHandler(cacheKey) : ({} as ReturnType<typeof getCacheHandler>);

  const getCache = async () => {
    /** 直接从缓存中获取数据 */
    if (cache?.key && cache.type) {
      const cacheData = storage[cache.type].getItem(cache.key);
      if (cacheData) {
        return cacheData as T;
      }
    }
  };

  /** 发送请求 */
  const sendRequest = async () => {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: options?.headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    const res = await response.json();
    let success = false;
    if (Array.isArray(res) || /success|ok|成功/.test(res.msg)) success = true;
    /** 缓存数据 */
    if (success && cache?.key && cache.type) storage[cache.type].setItem(cache.key, res);
    return res;
  };

  const getData = async () => (await getCache()) || (await sendRequest());

  /** 请求超时 */
  let _timeout: NodeJS.Timeout;
  const timeoutPromise = () => {
    return new Promise((_, reject) => {
      _timeout = setTimeout(() => {
        reject(new Error('请求超时'));
      }, timeout);
    });
  };

  /**
   * 这里使用race方法，让sendRequest()和timeoutPromise()并行执行，当sendRequest()执行完毕后，立即返回结果，
   * 而timeoutPromise()将会在sendRequest()执行超时后被取消。
   */
  return Promise.race([getData(), timeoutPromise()]).then((data) => {
    clearTimeout(_timeout);
    return data as T;
  });
};

export const cookie = {
  getParams: () => {
    const params: Obj = {};
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie) {
        const [key, value] = cookie.split('=');
        params[key] = value;
      }
    }
    return params;
  },
  getParam: (key: string) => {
    const params = cookie.getParams();
    return params[key];
  },
  setParams: (params: Obj, expires: number) => {
    const cookieStr = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    document.cookie = `${cookieStr}; expires=${expires}`;
  },
  setParam: (key: string, value: string, expires: number) => {
    const params = cookie.getParams();
    params[key] = value;
    cookie.setParams(params, expires);
  },
  removeParam: (key: string, expires: number) => {
    const params = cookie.getParams();
    delete params[key];
    cookie.setParams(params, expires);
  },
};
