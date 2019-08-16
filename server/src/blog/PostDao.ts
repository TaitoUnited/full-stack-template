import { asCamelCase } from '../common/formatters';
import { Db } from '../common/types';
import { Post } from '../../shared/types/post';

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

  public async getAllPosts({ db }: { db: Db }): Promise<Post[]> {
    const data = await db.any(
      `
        SELECT ${this.tableColumns}
        FROM posts
        ORDER BY created_at DESC
      `
    );

    return asCamelCase(data);
  }

  public async createPost({
    db,
    subject,
    content,
    author,
  }: {
    db: Db;
    subject: string;
    content: string;
    author: string;
  }) {
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
      {
        subject,
        content,
        author,
      }
    );

    return asCamelCase(data);
  }
}
