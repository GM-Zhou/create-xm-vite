import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/Error/NotFound'));

export default function Router() {
  return (
    <Suspense>
      <HashRouter>
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='404' element={<NotFound />} />
          <Route path='/' element={<Navigate to='home' replace />} />
          <Route path='*' element={<Navigate to='NotFound' replace />} />
        </Routes>
      </HashRouter>
    </Suspense>
  );
}
