import { asCamelCase } from '../common/formatters';
import { Db } from '../common/types';
import { Post } from '../../shared/types/blog';

export class PostDao {
  private tableColumns = [
    'id',
    'created_at',
    'updated_at',
    'subject',
    'content',
    'author',
  ]
    .map(column => `posts.${column}`)
    .join(', ');

  public async getAllPosts(db: Db): Promise<Post[]> {
    const data = await db.any(
      `
        SELECT ${this.tableColumns}
        FROM posts
        ORDER BY created_at DESC
      `
    );

    return asCamelCase(data);
  }

  public async createPost(db: Db, post: Post) {
    const data = await db.one(
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

    return asCamelCase(data);
  }
}
