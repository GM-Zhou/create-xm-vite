import { ENV_MODE } from './env';
import { isObj } from './type';

export type ActionType = 'banner' | 'card';

/** URL 传递参数类型 */
export interface UrlParams extends Obj {
  /**
   * 渠道标识
   */
  app_key: string;
  /**
   * 用户通过什么行为来到当前页面，用该值从 getTemplate 中获取模板数据
   */
  action: ActionType;
  /**
   * getTemplate 的类型
   */
  tag: string;
  /**
   * 设备标识
   */
  device_id: string;
  /**
   * UUID
   */
  device_id_type: string;
  client_os_type: string;
  nonce: string;
  version: string;
}

/**
 * 获取 URL 参数对象
 * @param url - 需要解析的 URL，默认为当前页面 URL
 * @returns URL 参数对象
 */
export const getQuery = (url = window.location.href) => {
  const query: Obj = {};
  const search = url.split('?')[1];
  if (search) {
    const entries = search.split('&');
    entries.forEach((entry) => {
      const [key, value] = entry.split('=');
      query[key] = value;
    });
  }
  return query;
};

/**
 * 拼接 URL 参数到给定的 URL 上
 * @param url - 原始 URL
 * @param query - 需要添加的参数对象
 * @returns 拼接参数后的新 URL
 */
export const addQuery = (url: string, query: Obj) => {
  let newUrl = url;
  if (isObj(query)) {
    const entries = Object.entries(query);
    if (entries.length > 0) {
      const query = entries.map(([k, v]) => `${k}=${v}`).join('&');
      if (url.includes('?')) newUrl = `${url}&${query}`;
      else newUrl = `${url}?${query}`;
    }
  }
  return newUrl;
};

/**
 * 根据环境添加 url 前缀
 */
const getOutputUrl = () => {
  const prefixes = {
    production: 'https://api.ximalaya.com',
    test: 'https://api.ximalaya.com',
    local_dev: '/development',
    local_prod: '/production',
  };

  const baseUrl = {
    appSecret: '/elderly-ximalayaos-api/api/app/getAppSecret', // 获取 appSecret
    template: '/xmly-iot-api/content/template/get', // 获取模板数据
    listens: '/xmly-iot-api/content/listen/get', // 批量获取听单数据
    tracks: '/xmly-iot-api/content/track/get', // 批量获取声音数据，只在 card_block.jump_type 为 track 时使用
    albums: '/xmly-iot-api/content/album/get', // 批量获取专辑数据，只在 card_block.jump_type 为 album 时使用
    queryTrack: '/xmly-iot-api/content/track/query', // 根据声音id获取声音列表
    queryAlbum: '/xmly-iot-api/content/album/query', // 查询专辑数据
    queryPlayUrl: '/ximalayaos-openapi-xm/bff/open/get_play_info', // 获取播放地址
  };

  type BaseUrl = typeof baseUrl;

  const prefix = prefixes[ENV_MODE]; // 根据环境模式选择对应的前缀
  const outputUrl = {} as BaseUrl;

  (Object.keys(baseUrl) as (keyof BaseUrl)[]).forEach((key) => {
    const url = baseUrl[key];
    outputUrl[key] = url.startsWith('http') ? url : `${prefix}${url}`;
  });

  return outputUrl;
};

/**
 * 前缀后的 URL 对象
 */
export const outputUrl = getOutputUrl();
export type OutputUrl = typeof outputUrl;
