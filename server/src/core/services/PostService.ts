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
  constructor(
    private authService: AuthService,
    private postDao: PostDao
  ) {}

  public async search(input: {
    state: Context['state'];
    search: string | null;
    filterGroups: FilterGroup<PostFilter>[];
    order: Order;
    pagination?: Pagination;
  }) {
    validateFilterGroups(input.filterGroups, filterableFieldNames);
    validateFieldName(input.order.field, filterableFieldNames);
    validatePagination(input.pagination, true);

    this.authService.checkPermission({
      state: input.state,
      entityType: EntityType.POST,
      operation: Operation.LIST,
    });

    // Add additional filters
    // NOTE: Add additional filters according to user permissions
    const filterGroups = input.filterGroups;
    // filterGroups = addFilter({
    //   filterGroups,
    //   field: 'someFilter',
    //   value: someFilter,
    // });

    return this.postDao.search({
      db: input.state.tx,
      search: input.search,
      filterGroups,
      order: input.order,
      pagination: input.pagination,
    });
  }

  public read = memoizeAsync<Post>(this.readImpl, this);

  private async readImpl(state: Context['state'], id: string) {
    const post = await this.postDao.read(state.tx, id);
    if (!post) {
      throw Boom.notFound(`Post not found with id ${id}`);
    }

    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.READ,
      // Additional details for permission check:
      // account: post.accountId
    });

    return post;
  }

  public async create(state: Context['state'], input: CreatePostInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.CREATE,
      // Additional details for permission check:
      // account: input.accountId
    });

    return this.postDao.create(state.tx, input);
  }

  public async update(state: Context['state'], input: UpdatePostInput) {
    const post = await this.read(state, input.id);

    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.UPDATE,
      // Additional details for permission check:
      // account: post.accountId
    });

    return this.postDao.update(state.tx, input);
  }

  public async delete(state: Context['state'], input: DeletePostInput) {
    const post = await this.read(state, input.id);

    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.DELETE,
      // Additional details for permission check:
      // account: post.accountId
    });

    return this.postDao.delete(state.tx, input);
  }
}
