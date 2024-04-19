import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));

export default function Router() {
  return (
    <Suspense>
      <HashRouter>
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='*' element={<Navigate to='home' replace />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
}
