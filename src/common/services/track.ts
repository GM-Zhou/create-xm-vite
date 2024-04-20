import { request } from '@/utils/request';

import { getUrlWithSig } from './sig';

export namespace GetTrack {
  export interface Params {
    app_key: string;
    client_os_type: string;
    device_id: string;
    device_id_type: string;
    ids: string;
    nonce: string;
    timestamp: string;
    version: string;
  }

  export interface TrackData {
    id: number;
    track_id: number;
    album_id: number;
    source_type: number;
    title: string;
    img: string;
    pay_type: number;
    duration: number;
    play_count: number;
    main_source_id: number | null;
    play_url?: string;
  }

  export interface Request {
    code: number;
    msg: string;
    data: Record<string, TrackData>;
  }
}

export namespace GetTrackPlayUrl {
  export interface Params {
    app_key: string;
    client_os_type: string;
    device_id: string;
    device_id_type: string;
    id: number;
    nonce: string;
    sig: string;
    source_type: number;
    timestamp: string;
    version: string;
    [property: string]: any;
  }

  export interface Request {
    code: number;
    data: Data;
    msg: string;
    ret: number;
  }

  export interface Data {
    duration: number;
    id: number;
    play_size: number;
    play_url: string;
  }
}

/** 批量获取声音 */
export const getTracks = async (query: GetTrack.Params) => {
  const url = await getUrlWithSig('tracks', query);
  const res = await request<GetTrack.Request>(url);
  return res.data;
};

export const getTrackPlayUrl = async (query: GetTrackPlayUrl.Params) => {
  const url = await getUrlWithSig('queryPlayUrl', query);
  const res = await request<GetTrackPlayUrl.Request>(url);
  return res.data;
};
