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

    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.LIST,
    });

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
      await this.authService.checkPermission({
        state,
        entityType: EntityType.POST,
        operation: Operation.VIEW,
        entityId: post.id,
      });
    }

    return post;
  }

  public async create(state: Context['state'], post: CreatePostInput) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.ADD,
    });

    return this.postDao.create(state.tx, post);
  }

  public async update(state: Context['state'], post: UpdatePostInput) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.EDIT,
      entityId: post.id,
    });

    return this.postDao.update(state.tx, post);
  }

  public async delete(state: Context['state'], post: DeletePostInput) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.DELETE,
      entityId: post.id,
    });

    return this.postDao.delete(state.tx, post);
  }
}
