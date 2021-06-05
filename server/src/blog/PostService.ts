import { Context } from 'koa';
import { Service } from 'typedi';
import { Pagination, Filter, Order } from '../../shared/types/common';
import { Post, CreatePostInput } from '../../shared/types/blog';
import { PostDao } from './PostDao';

@Service()
export class PostService {
  constructor(private postDao: PostDao) {}

  public async readPosts(
    state: Context['state'],
    pagination: Pagination,
    filters: Filter<Post>[],
    order: Order
  ) {
    // NOTE: Add business logic here
    return this.postDao.readPosts(state.tx, pagination, filters, order);
  }

  public async createPost(state: Context['state'], post: CreatePostInput) {
    // NOTE: Add business logic here
    return this.postDao.createPost(state.tx, post);
  }
}
