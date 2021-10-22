import { PreloadHandler } from '~graphql';

export type PageEntry = (() => JSX.Element) & {
  preload?: PreloadHandler;
};
