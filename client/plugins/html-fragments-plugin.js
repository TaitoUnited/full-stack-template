import fs from 'fs';
import path from 'path';

const initiaThemeHTML = fs.readFileSync(
  path.resolve(__dirname, '../src/html/initial-theme.html'),
  'utf8'
);
const splashScreenHTML = fs.readFileSync(
  path.resolve(__dirname, '../src/html/splash-screen.html'),
  'utf8'
);
const splashScreenStylesHTML = fs.readFileSync(
  path.resolve(__dirname, '../src/html/splash-screen-styles.html'),
  'utf8'
);

export const htmlFragmentsPlugin = () => {
  return {
    name: 'taito-html-fragments-plugin',
    transformIndexHtml(html) {
      return html
        .replace('<!-- initial-theme.html -->', initiaThemeHTML)
        .replace('<!-- splash-screen.html -->', splashScreenHTML)
        .replace('<!-- splash-screen-styles.html -->', splashScreenStylesHTML)
        .replace(/<!--[\s\S]*?-->/g, ''); // remove all comments
    },
  };
};
