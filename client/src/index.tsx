import './index.css';

import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { setupErrorReporting } from '~services/reporting';

setupErrorReporting();

ReactDOM.render(<App />, document.getElementById('app'));

// NOTE: Service Worker is enabled only in production builds
// NOTE: check `serviceWorker.ts` if you want to use automatic app update propmt
// TODO: register service worker if needed
// serviceWorker.register();
serviceWorker.unregister();
