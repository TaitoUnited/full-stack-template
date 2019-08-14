import { Db } from '../common/types';
import { PostDao } from './PostDao';

export class PostService {
  private postDao: PostDao;

  constructor(injections: any = {}) {
    const { postDao = null } = injections;

    this.postDao = postDao || new PostDao();
  }

  public async getAllPosts(params: { db: Db }) {
    return this.postDao.getAllPosts(params);
  }

  public async createPost(params: {
    db: Db;
    subject: string;
    content: string;
    author: string;
  }) {
    return this.postDao.createPost(params);
  }
}
