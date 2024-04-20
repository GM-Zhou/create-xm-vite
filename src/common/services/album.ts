import { request } from '@/utils/request';

import { getUrlWithSig } from './sig';
import type { GetTrack } from './track';

export namespace GetAlbums {
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

  export interface Request {
    code: number;
    msg: string;
    data: Record<string, GetTrack.TrackData>;
  }
}

export namespace GetAlbum {
  export interface Params {
    album_id: number;
    app_key: string;
    client_os_type: string;
    device_id: string;
    device_id_type: string;
    limit: number;
    nonce: string;
    page: number;
    record_id?: number;
    sig: string;
    source_type?: string;
    timestamp: string;
    version: string;
    [property: string]: any;
  }

  export interface Request {
    code: number;
    data: Data;
    msg: string;
    [property: string]: any;
  }

  export interface Data {
    album: Album;
    count: number;
    current_page: number;
    tracks: GetTrack.TrackData[];
    [property: string]: any;
  }

  export interface Album {
    album_id: number;
    id: number;
    img: string;
    main_source_id: number;
    pay_type: number;
    play_count: number;
    source_type: number;
    title: string;
    track_count: number;
    [property: string]: any;
  }
}

/** 批量获取专辑 */
export const getAlbums = async (query: GetAlbums.Params) => {
  const url = await getUrlWithSig('albums', query);
  const res = await request<GetAlbums.Request>(url);
  return res.data;
};

/** 获取专辑详细信息，包括 tracks，以及声音定位 */
export const getAlbum = async (query: GetAlbum.Params) => {
  const url = await getUrlWithSig('queryAlbum', query);
  const res = await request<GetAlbum.Request>(url);
  return res.data;
};
