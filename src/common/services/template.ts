import type { FetchOptions } from '@/utils/request';
import { request } from '@/utils/request';
import type { ActionType } from '@/utils/url';

import { getUrlWithSig } from './sig';

export namespace GetTemplate {
  export interface Params extends Obj {
    app_key: string;
    client_os_type: string;
    device_id: string;
    device_id_type: string;
    nonce: string;
    sig: string;
    tag: 'home' | 'play_recommend';
    timestamp: string;
    version: string;
  }

  export interface Request {
    code: number;
    data: Datum[];
    msg: string;
  }

  export interface Datum {
    bg_img: string;
    cards: Card[];
    id: number;
    img: string;
    tag: string;
    title: string;
  }

  export interface Card {
    card_blocks: CardBlock[];
    color_value: string;
    id: number;
    img: string;
    jump_type: string;
    jump_value: string;
    ok_img: string;
    style: ActionType;
    title: string;
  }

  export type JumpType = 'track' | 'album' | 'listen' | 'h5';

  export interface AlbumMetadata {
    intro: string;
    pay_type: number;
    play_count: number;
    source_id: number;
    source_type: number;
  }

  export interface CardBlock {
    id: number;
    img: string;
    jump_type: JumpType;
    jump_value: string;
    title: string;
    metadata?: AlbumMetadata;
  }
}

/**
 * 获取模板数据
 * 进入该项目至少要请求一次来获取用户 template，如果需要获取推荐数据，则再次请求获取推荐 template
 * 两次请求的 tag 不同
 * @param {Params} query 参数对象
 * @returns {Promise<GetTemplate.Datum[]>} 模板数据
 */
export const getTemplate = async (query: GetTemplate.Params, options?: FetchOptions) => {
  const url = await getUrlWithSig('template', query);
  const res = await request<GetTemplate.Request>(url, options);
  return res.data;
};

/**
 * 从 userTemplate 中获取卡片块数据
 * @param {GetTemplate.Datum[]} template 模板数据
 * @param {Obj} query 参数对象
 * @returns {GetTemplate.CardBlock} 卡片块数据
 */
export const getCardBlock = (template: GetTemplate.Datum[], query: Obj) => {
  const { action } = query;
  const { cards } = template[0];
  const card = cards.find((item) => item.style === action);
  return card?.card_blocks[0];
};
