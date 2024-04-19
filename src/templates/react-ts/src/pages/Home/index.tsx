import './styles/index.scss';

import ComImg from '@/components/ComImg';

const Home = () => {
  return (
    <main className='home-page'>
      <h3>WELCOME TO XM-VITE</h3>
      <div>
        <ComImg
          src='https://tse1-mm.cn.bing.net/th/id/OIP-C.rO43wl8fR91WzCnEkZD7ngAAAA?rs=1&pid=ImgDetMain'
          // title='vite'
          // alt='vite'
          width={300}
          height={300}
        />
      </div>
    </main>
  );
};

export default Home;
