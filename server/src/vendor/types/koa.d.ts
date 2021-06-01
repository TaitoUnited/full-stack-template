// Additions by project
import { State } from '../common/types';

declare module 'koa' {
  interface Context<TState = State> {
    state: TState;
  }
}
