import fs from 'fs';
import path from 'path';

const initiaThemeHTML = fs.readFileSync(
  path.resolve(__dirname, 'initial-theme.html'),
  'utf8'
);
const splashScreenHTML = fs.readFileSync(
  path.resolve(__dirname, 'splash-screen.html'),
  'utf8'
);
const splashScreenStylesHTML = fs.readFileSync(
  path.resolve(__dirname, 'splash-screen-styles.html'),
  'utf8'
);

export const taitoHtmlPlugin = () => {
  return {
    name: 'taito-html-transform',
    transformIndexHtml(html) {
      return html
        .replace('<!-- initial-theme.html -->', initiaThemeHTML)
        .replace('<!-- splash-screen.html -->', splashScreenHTML)
        .replace('<!-- splash-screen-styles.html -->', splashScreenStylesHTML)
        .replace(/<!--[\s\S]*?-->/g, ''); // remove all comments
    },
  };
};
