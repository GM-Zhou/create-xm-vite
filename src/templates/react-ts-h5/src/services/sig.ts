import { request } from '@/utils/request';
import { getSig } from '@/utils/sig';
import { getTimestamp } from '@/utils/time';
import type { OutputUrl } from '@/utils/url';
import { addQuery, outputUrl } from '@/utils/url';

interface GetAppSecretRes {
  code: number;
  msg: string;
  result: {
    appSecret: string;
  };
}

/**
 * 获取应用密钥，项目中必须首先进行请求
 * @param appKey 应用标识
 * @returns 应用密钥
 */
const getAppSecret = async (appKey: string) => {
  let appSecret = '';
  if (appKey) {
    const url = addQuery(outputUrl.appSecret, { appKey });
    const secret = await request<GetAppSecretRes>(url, { cache: { type: 'session', key: 'appSecret' } });
    appSecret = secret.result.appSecret;
  }
  return appSecret;
};

/**
 * 获取带签名的URL
 * @param key URL键名
 * @param query 参数对象
 * @returns 带签名的URL
 */
export const getUrlWithSig = async (key: keyof OutputUrl, query: Obj) => {
  const appSecret = await getAppSecret(query.app_key);
  const newParams: Obj = { ...query, timestamp: getTimestamp() };
  if (appSecret) newParams.sig = getSig(newParams, appSecret);
  return addQuery(outputUrl[key], newParams);
};
