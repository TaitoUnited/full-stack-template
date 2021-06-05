import { Service } from 'typedi';
import { Db } from '../common/types';
import { createFilterFragment, createOrderFragment } from '../common/dao.utils';
import { Pagination, Filter, Order } from '../../shared/types/common';
import { Post, PaginatedPosts, CreatePostInput } from '../../shared/types/blog';

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
    .map((column) => `post.${column}`)
    .join(', ');

  public async readPosts(
    db: Db,
    pagination: Pagination,
    filters: Filter<Post>[],
    order: Order
  ): Promise<PaginatedPosts> {
    // TODO: check these implementations are ok (no SQL injection)
    const filterFragment = createFilterFragment(filters);
    const orderFragment = createOrderFragment(order, 'post');

    const count = await db.one(`select count(id) from post ${filterFragment}`);

    const data = await db.any(
      `
        SELECT ${this.tableColumns}
        FROM post
        ${filterFragment} ${orderFragment}
        offset $(offset) limit $(limit)
      `,
      {
        ...pagination,
      }
    );

    return {
      total: Number(count.count),
      data,
    };
  }

  public async createPost(db: Db, post: CreatePostInput) {
    return await db.one(
      `
        INSERT INTO post (
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
