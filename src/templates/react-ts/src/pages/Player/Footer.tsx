import { memo } from 'react';

const Footer = () => {
  return (
    <section className='footer'>
      <p>更多精彩内容，请打开喜马拉雅穿戴</p>
      <div className='btn'>立即打开</div>
    </section>
  );
};

export default memo(Footer);
