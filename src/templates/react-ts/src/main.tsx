
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { initRem } from './utils/flexible.ts';
import { monitor } from './utils/xmly.ts';

monitor();
initRem();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
