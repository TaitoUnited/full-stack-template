import fs from 'fs';
import { renderToStaticMarkup } from 'react-dom/server';
import SplashScreen from './SplashScreen';

export const taitoHtmlFragmentsPlugin = () => {
  const initiaThemeScript = fs.readFileSync(
    './plugins/html-fragments-plugin/initial-theme.html',
    'utf8'
  );
  const splashScreenCSS = fs.readFileSync(
    './plugins/html-fragments-plugin/SplashScreen.css',
    'utf8'
  );
  const splashScreenStylesHTML = `<style>${splashScreenCSS}</style>`;
  const splashScreenHTML = renderToStaticMarkup(<SplashScreen />);

  return {
    name: 'taito-html-fragments-plugin',
    transformIndexHtml(html) {
      return html
        .replace('<!-- initial-theme -->', initiaThemeScript)
        .replace('<!-- splash-screen -->', splashScreenHTML)
        .replace('<!-- splash-screen-styles -->', splashScreenStylesHTML)
        .replace(/<!--[\s\S]*?-->/g, ''); // remove all comments
    },
  };
};
