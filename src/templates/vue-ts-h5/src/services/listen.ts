import type { FetchOptions } from '@/utils/request';
import { request } from '@/utils/request';

import { getUrlWithSig } from './sig';

export namespace GetListen {
  export interface Params extends Obj {
    app_key: string;
    client_os_type: string;
    device_id: string;
    device_id_type: string;
    ids: string;
    limit: number;
    nonce: string;
    page: number;
    timestamp: string;
    version: string;
  }

  export interface Request {
    code: number;
    data: Record<string, Datum>;
    msg: string;
  }

  export interface Datum {
    biz_type: string;
    count: number;
    id: number;
    listens: Listen[];
    title: string;
  }

  export interface Listen {
    album_id: number | null;
    biz_id: number;
    duration: number | null;
    id: string;
    img: string;
    main_source_id: null;
    pay_type: number;
    play_count: number;
    source_id: number;
    source_type: number;
    title: string;
    track_count: number | null;
  }
}

export const getListen = async (query: GetListen.Params, options?: FetchOptions) => {
  const url = await getUrlWithSig('listens', query);
  const res = await request<GetListen.Request>(url, options);
  return res.data;
};
