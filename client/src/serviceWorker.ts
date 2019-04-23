import { Workbox } from 'workbox-window';

export const register = () => {
  if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    // Ask user to reload reload when new service worker is ready
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users

    // TODO: enable this if you want to notify the user about app update
    // adter they have first opened the cached version of the app.
    /*
    wb.addEventListener('waiting', () => {
      const text =
        'App was updated in the background. Do you want to reload the page to use the new version?';

      if (window.confirm(text)) {
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

        wb.messageSW({ type: 'SKIP_WAITING' });
      }
    });
    */

    wb.register();
  }
};

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
