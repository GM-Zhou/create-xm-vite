import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { getRandom } from '@/utils/sig';

interface ComImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * 封装 img，自带 loading 效果
 */
const ComImg: React.FC<ComImgProps> = (props) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const img = useRef<HTMLImageElement>(null);
  const hash = useMemo(() => getRandom(10), []);

  useEffect(() => {
    if (img.current) {
      img.current.addEventListener('load', () => {
        setShowPlaceholder(false);
      });
    }
  }, []);

  return (
    <div className={props.className} style={{ position: 'relative', overflow: 'hidden' }}>
      <img {...props} ref={img} data-hash={hash} />
      {showPlaceholder ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#e6e6e6',
          }}
        />
      ) : null}
    </div>
  );
};

export default memo(ComImg);
