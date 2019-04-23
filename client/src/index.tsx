import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import errorReporting from './common/services/reporting';
import Root from './Root';

errorReporting.setup();

// Where to mount on page
const appElement = document.getElementById('app');

ReactDOM.render(<Root />, appElement);

// NOTE: Service Worker is enabled only in production builds
// NOTE: check `serviceWorker.ts` if you want to use automatic app update propmt
// TODO: register service worker if needed
// serviceWorker.register();
serviceWorker.unregister();
