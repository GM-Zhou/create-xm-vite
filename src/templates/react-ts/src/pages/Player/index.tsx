import './styles/index.scss';

import { useCallback, useEffect, useRef, useState } from 'react';

import ComImg from '@/components/ComImg';
import useTitle from '@/hooks/useTitle';
import { type GetAlbum, getAlbum } from '@/services/album';
import { getListen } from '@/services/listen';
import { getCardBlock, type GetTemplate, getTemplate } from '@/services/template';
import { type GetTrack, getTrackPlayUrl, getTracks } from '@/services/track';
import classnames from '@/utils/classnames';
import { formatTime } from '@/utils/time';
import { isObj } from '@/utils/type';
import { getQuery } from '@/utils/url';

import Footer from './Footer';
import PopList from './PopList';
import RecoAlbums from './RecoAlbums';

enum Status {
  Paused,
  Playing,
}

const limit = 10;

const Player = () => {
  const query = getQuery() as GetTemplate.Params;
  const [albumData, setAlbumData] = useState({} as GetAlbum.Data);
  const [curTrack, setCurTrack] = useState({ duration: 0 } as GetTrack.TrackData);
  const [status, setStatus] = useState<Status>(Status.Paused);
  const [progress, setProgress] = useState(0);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [recoTemplate, setRecoTemplate] = useState<GetTemplate.Datum[]>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const percent = (progress / curTrack.duration) * 100;

  const isTouching = useRef(false);
  const canAutoPlay = useRef(false);

  const statusIcon = `iconfont ${status === Status.Paused ? 'icon-bofangqi-bofang' : 'icon-bofangqi-zanting'}`;

  const play = () => {
    setStatus(Status.Playing);
    audioRef.current?.play();
  };

  const pause = () => {
    setStatus(Status.Paused);
    audioRef.current?.pause();
  };

  const toggle = () => {
    if (audioRef.current?.paused) play();
    else pause();
  };

  /**
   * 执行音频切换并自动播放
   * @param {1 | -1 | GetTrack.TrackData} track - 要执行的切换操作，可以是音频数据或者-1和1(上一首和下一首)
   * @returns {Promise<void>} - 无返回值
   */
  const changeTrack = async (track: 1 | -1 | GetTrack.TrackData) => {
    canAutoPlay.current = true;
    const { tracks } = albumData;
    let newTrack = {} as GetTrack.TrackData;
    if (typeof track === 'number') {
      const curIndex = albumData.tracks.findIndex((item) => item.track_id === curTrack.track_id);
      const newIndex = curIndex + track;
      if (newIndex >= 0 && newIndex < tracks.length) {
        newTrack = tracks[newIndex];
      }
    } else {
      newTrack = track;
    }

    // track_id 相同，则不执行切换操作，否则先暂停，再切换
    if (newTrack.track_id && newTrack.track_id !== curTrack.track_id) {
      pause();
      newTrack = await addPlayUrlToTrack(newTrack);
      setCurTrack(newTrack);
    }
  };

  const onTouchStart = () => {
    isTouching.current = true;
  };

  /**
   * 触摸结束后，更新进度条和播放器状态，并自动播放
   */
  const onTouchEnd = () => {
    audioRef.current!.currentTime = progress;
    isTouching.current = false;
    play();
  };

  const onTouchCancel = () => {
    isTouching.current = false;
  };

  const togglePlaylist = () => {
    setPlaylistVisible((v) => !v);
  };

  const onItemClick = useCallback((track: GetTrack.TrackData) => {
    changeTrack(track);
    setPlaylistVisible(false);
  }, []);

  const onPlaylistClose = useCallback(() => {
    setPlaylistVisible(false);
  }, []);

  /**
   * 上拉加载更多音频
   */
  const loadMore = async () => {
    const { album_id } = curTrack;
    const tracksLen = albumData.tracks.length;
    if (tracksLen < albumData.count) {
      const remoteAlbumData = await getAlbum({ ...query, page: albumData.current_page + 1, limit, album_id });
      const tracks = albumData.tracks.concat(remoteAlbumData.tracks);
      const newAlbumData = { ...albumData, ...remoteAlbumData, tracks };
      setAlbumData(newAlbumData);
    }
  };

  /**
   * 添加音频播放地址
   * @param {GetTrack.TrackData} track - 要添加播放地址的音频数据
   * @returns {Promise<GetTrack.TrackData>} - 返回带有播放地址的音频数据
   */
  const addPlayUrlToTrack = async (track: GetTrack.TrackData) => {
    const data = await getTrackPlayUrl({
      ...query,
      id: track.track_id,
      source_type: track.source_type,
    });
    return {
      ...track,
      play_url: data.play_url,
    };
  };

  /**
   * 初始化播放器首播数据
   * 用户没有交互，不能自动播放，所以不能使用 changeTrack
   * @param tracks
   * @param index
   */
  const initTrack = async (track: GetTrack.TrackData) => {
    const newTrack = await addPlayUrlToTrack(track);
    setCurTrack(newTrack);
  };

  const handleTrackType = async ({ jump_value }: GetTemplate.CardBlock) => {
    const trackData = await getTracks({ ...query, ids: jump_value });
    const track = trackData[jump_value];
    const remoteAlbumData = await getAlbum({
      ...query,
      page: albumData.current_page || 1,
      limit,
      album_id: track.album_id,
      record_id: track.track_id,
    });
    if (remoteAlbumData.tracks.length) {
      const newAlbumData = { ...albumData, ...remoteAlbumData };
      setAlbumData(newAlbumData);
      const index = newAlbumData.tracks.findIndex((item) => item.track_id === track.track_id);
      initTrack(albumData.tracks[index]);
    }
  };

  const handleAlbumType = async ({ metadata }: GetTemplate.CardBlock) => {
    if (metadata?.source_id) {
      const remoteAlbumData = await getAlbum({
        ...query,
        page: albumData.current_page || 1,
        limit,
        album_id: metadata.source_id,
      });
      if (remoteAlbumData.tracks.length) {
        const newAlbumData = { ...albumData, ...remoteAlbumData };

        setAlbumData(newAlbumData);
        initTrack(newAlbumData.tracks[0]);
      }
    }
  };

  const handleListenType = async (cardBlock: GetTemplate.CardBlock) => {
    const listenData = await getListen({ ...query, ids: cardBlock.jump_value, page: 1, limit: 10 });
    if (isObj(listenData)) {
      if (cardBlock) {
        // const listens = listenData[cardBlock.jump_value];
      }
    }
  };

  /**
   * 根据 jump_type 判断是声音还是专辑或听单
   * 然后根据 jump_value 请求对应类型的数据
   * 获取声音也和 getListen 类似，只是接口变为 track
   * @param {GetTemplate.CardBlock} cardBlock - 卡片区块
   * @returns {Promise<void>}
   */
  const handleCardBlock = (cardBlock?: GetTemplate.CardBlock) => {
    if (cardBlock) {
      const { jump_type } = cardBlock;
      if (jump_type === 'track') handleTrackType(cardBlock);
      else if (jump_type === 'album') handleAlbumType(cardBlock);
      else if (jump_type === 'listen') handleListenType(cardBlock);
    }
  };

  const getRecoTemp = async () => {
    const recoTempData = await getTemplate({ ...query, tag: 'play_recommend' });
    if (recoTempData) setRecoTemplate(recoTempData);
  };

  const handleUserTemplate = async (userTemplate: GetTemplate.Datum[]) => {
    if (userTemplate?.length) {
      const cardBlock = getCardBlock(userTemplate, query);
      handleCardBlock(cardBlock);
    }
  };

  const initData = async () => {
    const userTemplate = await getTemplate(query, { cache: { key: 'userTemplate', type: 'session' } });
    handleUserTemplate(userTemplate);
    getRecoTemp();
  };

  const initAudio = () => {
    const audio = audioRef.current!;
    if (audio) {
      audio.onloadeddata = () => {
        // 页面首次加载，用户未点击，禁止自动播放
        if (canAutoPlay.current) play();
      };
      audio.ontimeupdate = () => {
        if (!isTouching.current) {
          setProgress(Math.floor(audio.currentTime));
        }
      };
      audio.onended = () => {
        setProgress(curTrack.duration);
        pause();
      };
    }
  };

  useTitle('Player');

  useEffect(() => {
    initData();
    initAudio();
  }, []);

  return (
    <main className='player-page'>
      <audio ref={audioRef} src={curTrack.play_url} />
      <section className='player-cover'>
        <ComImg className='player-cover-img' src={curTrack.img} />
        <h3 className={classnames('player-cover-title', { placeholder: !curTrack.title })}>{curTrack.title}</h3>
      </section>
      <section className='progress-bar'>
        <input
          type='range'
          value={progress}
          min={0}
          max={curTrack.duration}
          style={{ background: `linear-gradient(to right, #f8675d ${percent}%, #e6e6e6 ${percent}%)` }}
          onChange={(e) => {
            const v = Number(e.target.value);
            audioRef.current!.currentTime = v;
            setProgress(v);
          }}
          onInput={(e: any) => {
            const v = Number(e.target.value);
            setProgress(v);
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        />
      </section>
      <section className='time-bar'>
        <div className='time-txt'>{formatTime(progress)}</div>
        <div className='time-txt'>{formatTime(curTrack.duration)}</div>
      </section>
      <section className='player-footer'>
        <div className='player-list' onClick={togglePlaylist}>
          <i
            className={classnames('iconfont icon-liebiao', {
              active: playlistVisible,
            })}
          />
        </div>
        <div className='player-btns'>
          <div className='player-btn' onClick={() => changeTrack(-1)}>
            <i className='iconfont icon-shangyiji' />
          </div>
          <div className='player-btn play' onClick={toggle}>
            <i className={statusIcon} />
          </div>
          <div className='player-btn' onClick={() => changeTrack(1)}>
            <i className='iconfont icon-xiayiji' />
          </div>
        </div>
      </section>
      {playlistVisible ? (
        <PopList
          albumData={albumData}
          curTrack={curTrack}
          onEndReachedThreshold={100}
          onItemClick={onItemClick}
          onClose={onPlaylistClose}
          onEndReached={loadMore}
        />
      ) : null}
      <RecoAlbums recoTemplate={recoTemplate} />
      <Footer />
    </main>
  );
};

export default Player;
