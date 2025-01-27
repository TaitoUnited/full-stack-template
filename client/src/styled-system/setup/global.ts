import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
  'html, body': {
    margin: 0,
    padding: 0,
    fontSize: '16px',
    wordWrap: 'break-word',
    width: '100%',
    height: '100%',
    minHeight: '100%',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '$surface',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitOverflowScrolling: 'touch',
    WebkitTapHighlightColor: 'transparent',
  },

  '#app': {
    width: '100%',
    height: '100%',
  },

  'button, input, textarea, select, optgroup': {
    outline: 'none', // focus ring should be added manually
    appearance: 'none',
    borderWidth: '0',
    padding: '0',
    background: 'transparent',
    WebkitTapHighlightColor: 'transparent',
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
  },

  img: {
    maxWidth: '100%',
  },

  '*': {
    boxSizing: 'border-box',
    borderStyle: 'solid',
  },

  'ul, ol': {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },

  li: {
    margin: 0,
    listStyle: 'none',
  },

  button: {
    cursor: 'pointer',
  },
});
