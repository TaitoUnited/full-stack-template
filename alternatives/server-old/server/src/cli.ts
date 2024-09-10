import 'module-alias/register';
import 'reflect-metadata';
import { Container } from 'typedi';
import getDb from './common/setup/db';
import { PostDao } from './core/daos/PostDao';
import { CreatePostInput } from './core/types/post';

// ------------------------------------------------------------------
// CLI commands for cronjobs, etc.
//
// You can execute CLI commands manually with:
// taito exec:server:ENV ./cli.sh COMMAND [ARGS...]
//
// You can also schedule CLI command execution with cronjobs. See
// `scripts/helm/examples.yaml` for examples.
// ------------------------------------------------------------------

export const createPost = async (
  subject?: string,
  author?: string,
  content?: string
) => {
  const db = await getDb();
  const postDao = Container.get(PostDao);

  const post: CreatePostInput = {
    subject: subject || 'example subject',
    author: author || 'example author,',
    content: content || 'example content',
  };
  await postDao.create(db, post);
  console.log('New post created.');
};

export const commands = {
  createPost,
};

const main = () => {
  const command = process.argv[2];
  // @ts-ignore
  const func = commands[command];
  if (!func) {
    console.error(`ERROR: Unknown command '${command}'.`);
    process.exit(1);
  }
  func(...process.argv.slice(3));
};

if (require.main === module) {
  main();
}
