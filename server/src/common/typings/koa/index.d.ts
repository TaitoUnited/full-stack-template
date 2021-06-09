// Additions by project
import { State } from '../../types';

declare module 'koa' {
  interface KoaRequest extends Request {
    body?: any;
  }

  interface Context<TState = State> {
    state: TState;
    request: KoaRequest;
  }
}
