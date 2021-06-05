import { Service } from 'typedi';
import { Db } from '../common/types';
import { Pagination, Filter, Order } from '../../shared/types/common';
import { Post, CreatePostInput } from '../../shared/types/blog';

@Service()
export class PostDao {
  private tableColumns = [
    'id',
    'created_at',
    'updated_at',
    'subject',
    'content',
    'author',
  ]
    .map((column) => `posts.${column}`)
    .join(', ');

  public async readPosts(
    db: Db,
    pagination: Pagination,
    filters: Filter<Post>[],
    order: Order
  ): Promise<Post[]> {
    // TODO: use pagination, filters, and order in SQL query
    return await db.any(
      `
        SELECT ${this.tableColumns}
        FROM posts
        ORDER BY created_at DESC
      `
    );
  }

  public async createPost(db: Db, post: CreatePostInput) {
    return await db.one(
      `
        INSERT INTO posts (
          subject,
          content,
          author
        ) VALUES (
          $[subject],
          $[content],
          $[author]
        )
        RETURNING ${this.tableColumns}
      `,
      post
    );
  }
}
