import { useEffect } from 'react';

import Router from './router';
import { storage } from './utils/storage';
import { getQuery } from './utils/url';

const App = () => {
  useEffect(() => {
    const query = getQuery();
    if (query.app_key) storage.session.setItem('baseInfo', query);
  }, []);
  return <Router />;
};

export default App;
