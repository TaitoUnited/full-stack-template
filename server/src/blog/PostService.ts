import { State } from '../common/types';
import { Post } from '../../shared/types/blog';
import { PostDao } from './PostDao';

export class PostService {
  private postDao: PostDao;

  constructor(injections: any = {}) {
    const { postDao = null } = injections;

    this.postDao = postDao || new PostDao();
  }

  public async getAllPosts(state: State) {
    return this.postDao.getAllPosts(state.tx);
  }

  public async getPost(state: State, id: string) {
    return this.postDao.getPost(state.tx, id);
  }

  public async createPost(state: State, post: Post) {
    return this.postDao.createPost(state.tx, post);
  }
}
