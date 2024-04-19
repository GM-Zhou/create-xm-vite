import { memo, useEffect, useState } from 'react';

import type { GetListen } from '@/services/listen';
import { getListen } from '@/services/listen';
import type { GetTemplate } from '@/services/template';
import { isObj } from '@/utils/type';
import { getQuery } from '@/utils/url';

interface Props {
  recoTemplate?: GetTemplate.Datum[];
}

const RecoAlbums: React.FC<Props> = ({ recoTemplate }) => {
  const query: any = getQuery();
  const [templateData, setTemplateData] = useState<GetTemplate.Datum>();
  const [litenList, setListenList] = useState<GetListen.Datum>();

  const initData = async () => {
    if (Array.isArray(recoTemplate) && recoTemplate.length) {
      setTemplateData(recoTemplate[0]);
      const card = recoTemplate[0].cards[0];
      // 目前只有听单类型
      if (card.jump_type === 'listen') {
        const listenData = await getListen({
          ...query,
          ids: card.jump_value,
          page: 1,
          limit: 20,
        });
        if (isObj(listenData)) {
          const listens = listenData[card.jump_value];
          if (listens) setListenList(listens);
        }
      }
    }
  };

  useEffect(() => {
    initData();
  }, [recoTemplate]);

  return (
    <section className='reco-albums'>
      <h2 className='title'>{templateData?.title || '猜你喜欢'}</h2>
      <ul>
        {litenList?.listens?.map((item) => {
          return (
            <li key={item.id}>
              <img className='album-cover' src={item.img} />
              <span className='album-title'>{item.title}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default memo(RecoAlbums);
