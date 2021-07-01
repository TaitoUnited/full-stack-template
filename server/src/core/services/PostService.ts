import { Context } from 'koa';
import { Service } from 'typedi';
import {
  validateFilterGroups,
  validateColumnName,
} from '../../common/utils/validate';
import { keysAsSnakeCaseArray } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  Post,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
  postExample,
} from '../types/post';
import { PostDao } from '../daos/PostDao';

const filterableColumnNames = keysAsSnakeCaseArray(postExample);

// TODO: add support for @Authorized annotation on service level
@Service()
export class PostService {
  constructor(private postDao: PostDao) {}

  public async search(
    state: Context['state'],
    search: string | null,
    filterGroups: FilterGroup<Post>[],
    order: Order,
    pagination: Pagination
  ) {
    // NOTE: Add user right checks, validation, and business logic here
    validateColumnName(order.field, filterableColumnNames);
    validateFilterGroups(filterGroups, filterableColumnNames);

    return this.postDao.search(
      state.tx,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  public async read(state: Context['state'], id: string) {
    // NOTE: Add user right checks, validation, and business logic here
    return this.postDao.read(state.tx, id);
  }

  public async create(state: Context['state'], post: CreatePostInput) {
    // NOTE: Add user right checks, validation, and business logic here
    return this.postDao.create(state.tx, post);
  }

  public async update(state: Context['state'], post: UpdatePostInput) {
    // NOTE: Add user right checks, validation, and business logic here
    return this.postDao.update(state.tx, post);
  }

  public async delete(state: Context['state'], post: DeletePostInput) {
    // NOTE: Add user right checks, validation, and business logic here
    return this.postDao.delete(state.tx, post);
  }
}
