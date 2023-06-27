import fs from 'fs';
import crypto from 'crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import SplashScreen from './SplashScreen';

function getIconSpriteLink(sprite) {
  // Add hash to icon sprite to force browser to reload it when the content changes
  const hash = crypto.createHash('sha256').update(sprite).digest('hex');
  return `<link rel="preload" as="image" type="image/svg+xml" href="/icon-sprite.svg?v=${hash}" />`;
}

export function taitoHtmlFragmentsPlugin() {
  const iconSpriteSvg = fs.readFileSync('./assets/icon-sprite.svg', 'utf8');
  const initiaThemeScript = fs.readFileSync('./plugins/html-fragments-plugin/initial-theme.html', 'utf8'); // prettier-ignore
  const splashScreenCSS = fs.readFileSync('./plugins/html-fragments-plugin/SplashScreen.css', 'utf8'); // prettier-ignore
  const splashScreenStylesHTML = `<style>${splashScreenCSS}</style>`;
  const splashScreenHTML = renderToStaticMarkup(<SplashScreen />);

  return {
    name: 'taito-html-fragments-plugin',
    transformIndexHtml(html) {
      return html
        .replace('<!-- initial-theme -->', initiaThemeScript)
        .replace('<!-- splash-screen -->', splashScreenHTML)
        .replace('<!-- splash-screen-styles -->', splashScreenStylesHTML)
        .replace('<!-- icon-sprite.html -->', getIconSpriteLink(iconSpriteSvg))
        .replace(/<!--[\s\S]*?-->/g, ''); // remove all comments
    },
  };
}
