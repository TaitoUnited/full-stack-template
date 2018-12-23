import authorize from '../common/authorize.util.js';
import db from './post.db';

export default class PostService {
  constructor(postDB) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.postDB = postDB || db;
  }

  async fetch(state, criteria) {
    authorize(state).role('admin', 'user');
    return {
      totalCount: await this.postDB.fetch(state.getTx(), criteria, true),
      data: await this.postDB.fetch(state.getTx(), criteria),
    };
  }

  async create(state, post) {
    authorize(state).role('admin', 'user');
    const id = await this.postDB.create(state.getTx(), post);
    return this.postDB.read(state.getTx(), id);
  }

  async read(state, id) {
    authorize(state).role('admin', 'user');
    return this.postDB.read(state.getTx(), id);
  }

  async update(state, post) {
    authorize(state).role('admin');
    await this.postDB.update(state.getTx(), post);
  }

  async patch(state, post) {
    authorize(state).role('admin');
    await this.postDB.patch(state.getTx(), post);
  }

  async remove(state, id) {
    authorize(state).role('admin');
    await this.postDB.remove(state.getTx(), id);
  }
}
