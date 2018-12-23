import authorize from '../common/authorize.util.js';
import db from './file.db';

export default class FileService {
  constructor(fileDB) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.fileDB = fileDB || db;
  }

  async fetch(state, criteria) {
    authorize(state).role('admin', 'user');
    return {
      totalCount: await this.fileDB.fetch(state.getTx(), criteria, true),
      data: await this.fileDB.fetch(state.getTx(), criteria),
    };
  }

  async create(state, file) {
    authorize(state).role('admin', 'user');
    const id = await this.fileDB.create(state.getTx(), file);
    return this.fileDB.read(state.getTx(), id);
  }

  async read(state, id) {
    authorize(state).role('admin', 'user');
    return this.fileDB.read(state.getTx(), id);
  }

  async update(state, file) {
    authorize(state).role('admin');
    await this.fileDB.update(state.getTx(), file);
  }

  async patch(state, file) {
    authorize(state).role('admin');
    await this.fileDB.patch(state.getTx(), file);
  }

  async remove(state, id) {
    authorize(state).role('admin');
    await this.fileDB.remove(state.getTx(), id);
  }
}
