import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';

import { memoizeAsync } from '../../common/utils/cache';
import { EntityType, Operation } from '../../common/types/entity';
import { getObjectKeysAsFieldNames } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  validateFilterGroups,
  validateFieldName,
  validatePagination,
} from '../../common/utils/validate';

import {
  Post,
  PostFilter,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
} from '../types/post';

import { AuthService } from './AuthService';
import { PostDao } from '../daos/PostDao';

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

  public read = memoizeAsync<Post>(this.readImpl, this);

  private async readImpl(state: Context['state'], id: string) {
    const post = await this.postDao.read(state.tx, id);
    if (!post) {
      throw Boom.notFound(`Post not found with id ${id}`);
    }

    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.VIEW,
      entityId: post.id,
    });

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
