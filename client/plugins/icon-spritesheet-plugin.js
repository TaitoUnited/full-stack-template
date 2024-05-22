import fs from 'fs';
import crypto from 'crypto';

export function iconSpritesheet() {
  const iconSpriteSvg = fs.readFileSync('./assets/icon-sprite.svg', 'utf8');
  const hash = crypto.createHash('sha256').update(iconSpriteSvg).digest('hex');
  const linkTag = `<link rel="preload" as="image" type="image/svg+xml" href="/icon-sprite.svg?v=${hash}" />`;

  return {
    name: 'taito-icon-spritesheet-plugin',
    transformIndexHtml(html) {
      // Add styles to end of head
      return html.replace('</head>', `${linkTag}</head>`);
    },
  };
}
