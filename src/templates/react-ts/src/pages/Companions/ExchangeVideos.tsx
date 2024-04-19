/**
 * 陪伴机视频兑换码页面
 */

import './styles/ExchangeVideos.scss';

import { getQuery } from '@/utils/url';

const ExchangeVideos = () => {
  const query = getQuery();

  const copy = async () => {
    navigator.clipboard.writeText(query.code).then(() => {
      alert('复制成功');
    });
  };

  return (
    <main className='companions-exchange-videos'>
      <p className='code'>
        <span className='label'>兑换码：</span>
        <span className='code-text'>{query.code}</span>
        <button className='copy-btn' onClick={copy}>
          复制
        </button>
      </p>
    </main>
  );
};

export default ExchangeVideos;
