import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const Player = lazy(() => import('@/pages/Player'));
const ExchangeVideos = lazy(() => import('@/pages/Companions/ExchangeVideos'));
const NotFound = lazy(() => import('@/pages/Error/NotFound'));

export default function Router() {
  return (
    <Suspense>
      <HashRouter>
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='player' element={<Player />} />
          <Route path='player' element={<Player />} />
          <Route path='companions'>
            <Route path='exchange-videos' element={<ExchangeVideos />} />
          </Route>
          <Route path='404' element={<NotFound />} />
          <Route path='*' element={<Navigate to='404' replace />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
}
