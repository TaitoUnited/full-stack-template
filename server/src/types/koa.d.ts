// Additions by project
import { State } from '../common/types';

declare module 'koa' {
  interface Context {
    state: State;
  }
}
