import { Context } from 'koa';
import { Service } from 'typedi';

import {
  validateFilterGroups,
  validateFieldName,
  validatePagination,
} from '../../common/utils/validate';

import {
  PostFilter,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
} from '../types/post';

import { getObjectKeysAsFieldNames } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import { EntityType, Operation } from '../../common/types/entity';
import { PostDao } from '../daos/PostDao';
import { AuthService } from './AuthService';

const filterableFieldNames = getObjectKeysAsFieldNames(new PostFilter());

@Service()
export class PostService {
  constructor(private authService: AuthService, private postDao: PostDao) {}

  public async search(
    state: Context['state'],
    search: string | null,
    origFilterGroups: FilterGroup<PostFilter>[],
    order: Order,
    pagination?: Pagination
  ) {
    validateFilterGroups(origFilterGroups, filterableFieldNames);
    validateFieldName(order.field, filterableFieldNames);
    validatePagination(pagination, true);

    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.LIST
    );

    // NOTE: Add additional filters according to user permissions

    // Add additional filters
    const filterGroups = origFilterGroups;

    // filterGroups = addFilter({
    //   filterGroups,
    //   field: 'someFilter',
    //   value: someFilter,
    // });

    return this.postDao.search(
      state.tx,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  public async read(state: Context['state'], id: string) {
    const post = await this.postDao.read(state.tx, id);

    if (post) {
      // Check permissions
      await this.authService.checkPermission(
        state,
        EntityType.POST,
        Operation.VIEW,
        post.id
      );
    }

    return post;
  }

  public async create(state: Context['state'], post: CreatePostInput) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.ADD
    );

    return this.postDao.create(state.tx, post);
  }

  public async update(state: Context['state'], post: UpdatePostInput) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      post.id
    );

    return this.postDao.update(state.tx, post);
  }

  public async delete(state: Context['state'], post: DeletePostInput) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.DELETE,
      post.id
    );

    return this.postDao.delete(state.tx, post);
  }
}
