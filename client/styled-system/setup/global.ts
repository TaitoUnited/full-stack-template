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
    backgroundColor: '$background',
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
    appearance: 'none',
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    WebkitTapHighlightColor: 'transparent',
    fontFamily: "'Inter', sans-serif",
  },

  img: {
    maxWidth: '100%',
  },

  '*': {
    boxSizing: 'border-box',
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
    border: 'none',
    background: 'none',
    padding: 0,
    cursor: 'pointer',
  },
});
