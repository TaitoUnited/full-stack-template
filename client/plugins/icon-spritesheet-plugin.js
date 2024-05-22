import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function iconSpritesheet() {
  let config;

  return {
    name: 'taito-icon-spritesheet-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml(html) {
      const iconSpriteSvg = fs.readFileSync(
        path.resolve(config.publicDir, 'icon-sprite.svg'),
        'utf8'
      );

      const hash = crypto
        .createHash('sha256')
        .update(iconSpriteSvg)
        .digest('hex');

      const linkTag = `<link rel="preload" as="image" type="image/svg+xml" href="/icon-sprite.svg?v=${hash}" />`;

      // Add link tag to end of head
      return html.replace('</head>', `${linkTag}</head>`);
    },
  };
}
