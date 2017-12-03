import PostDAO from './post.dao';

/**
 * Responsibilities of a service:
 *
 * - Validates the given parameters.
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - For write operations ensures that there is a transaction present
 *   (most write operation should be atomic).
 * - Executes the operation with the help of fine-grained DAOs and other
 *   services.
 * - Does not operate on http request and response directly.
 * - Throws an exception in case of an error.
 *
 * NOTE: In a really simple application you may combine router, service and dao
 * into one class in which you parse request, authorize, validate,
 * execute database operation and generate response with a single method.
 */
export default class PostService {
  constructor(postDAO) {
    this.postDAO = postDAO || new PostDAO();
  }

  async fetch(ctx, criteria) {
    return await this.postDAO.fetch(ctx.getTx(), criteria);
  }

  async create(ctx, post) {
    return await this.postDAO.create(ctx.db, post);
  }

  async read(ctx, id) {
    return await this.postDAO.read(ctx.getTx(), id);
  }

  async update(ctx, post) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this.postDAO.update(tx, post);
    });
  }

  async patch(ctx, post) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this.postDAO.patch(tx, post);
    });
  }

  async remove(ctx, id) {
    // Write operation -> execute the operation inside a transaction
    return await ctx.tx(async tx => {
      await this.postDAO.remove(tx, id);
    });
  }
}
