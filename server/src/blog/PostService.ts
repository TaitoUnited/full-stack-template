import { Context } from 'koa';
import { Post } from '../../shared/types/blog';
import { PostDao } from './PostDao';

export class PostService {
  private postDao: PostDao;

  constructor(injections: any = {}) {
    const { postDao = null } = injections;

    this.postDao = postDao || new PostDao();
  }

  public async getAllPosts(state: Context['state']) {
    return this.postDao.getAllPosts(state.tx);
  }

  public async getPost(state: Context['state'], id: string) {
    return this.postDao.getPost(state.tx, id);
  }

  public async createPost(state: Context['state'], post: Post) {
    return this.postDao.createPost(state.tx, post);
  }
}
