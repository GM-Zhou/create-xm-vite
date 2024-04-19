import { memo, useEffect, useState } from 'react';

import type { GetAlbum } from '@/services/album';
import type { GetTrack } from '@/services/track';
import classnames from '@/utils/classnames';

interface Props {
  albumData: GetAlbum.Data;
  curTrack: GetTrack.TrackData;
  onEndReachedThreshold?: number;
  onEndReached?: () => void;
  onItemClick: (track: GetTrack.TrackData) => void;
  onClose: () => void;
}

const PopList: React.FC<Props> = (props) => {
  const [hasEndReached, setHasEndReached] = useState(false);
  const { albumData, curTrack, onEndReachedThreshold = 50, onEndReached, onClose, onItemClick } = props;

  // 定位到指定元素
  useEffect(() => {
    if (curTrack) {
      const track = curTrack;
      const ulDom = document.querySelector('.pop-playlist ul') as HTMLUListElement;
      const liDom = ulDom.querySelector(`li[data-track-id="${track.track_id}"]`) as HTMLLIElement;
      if (liDom) {
        const scrollTop = liDom.offsetTop - ulDom.offsetTop - 100;
        ulDom.scrollTo({ top: scrollTop, behavior: 'instant' });
      }
    }
  }, [curTrack]);

  return (
    <section className='pop-playlist' onClick={onClose}>
      <ul
        onScroll={(e) => {
          const ulDom = e.target as HTMLUListElement;
          const { clientHeight, scrollHeight, scrollTop: _scrollTop } = ulDom;
          const _hasEndReached = scrollHeight - clientHeight < _scrollTop + onEndReachedThreshold;
          if (_hasEndReached && !hasEndReached) {
            setHasEndReached(true);
            onEndReached?.();
          } else if (!_hasEndReached) {
            setHasEndReached(false);
          }
        }}
      >
        {albumData.tracks.map((track) => {
          return (
            <li
              key={track.track_id}
              data-track-id={track.track_id}
              className={classnames('pop-playlist-li', { active: track.track_id === curTrack.track_id })}
              onClick={() => onItemClick(track)}
            >
              {track.title}
            </li>
          );
        })}
        {albumData.tracks.length === albumData.count ? (
          <footer className='pop-playlist-footer'>没有更多了</footer>
        ) : null}
      </ul>
    </section>
  );
};

export default memo(PopList);
