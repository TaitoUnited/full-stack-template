import { Context } from 'koa';
import { Service } from 'typedi';
import {
  addFilter,
  validateFilterGroups,
  validateFieldName,
} from '../../common/utils/validate';
import { keysAsSnakeCaseArray } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  PostFilter,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
  postFilterExample,
} from '../types/post';
import { PostDao } from '../daos/PostDao';
import { EntityType, Operation } from '../types/core';
import { CoreAuthService } from './CoreAuthService';

const filterableFieldNames = Object.getOwnPropertyNames(
  postFilterExample
);

@Service()
export class PostService {
  constructor(
    private coreAuthService: CoreAuthService,
    private postDao: PostDao
  ) {}

  public async search(
    state: Context['state'],
    search: string | null,
    origFilterGroups: FilterGroup<PostFilter>[],
    order: Order,
    pagination: Pagination | null
  ) {
    validateFilterGroups(origFilterGroups, filterableFieldNames);
    validateFieldName(order.field, filterableFieldNames);

    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.POST,
      Operation.LIST
    );

    // NOTE: Add additional filters according to user permissions

    // Add additional filters
    const filterGroups = origFilterGroups;
    // const filterGroups = addFilter(
    //   origFilterGroups,
    //   PostFilter,
    //   'someFilter',
    //   someFilter
    // );

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
      await this.coreAuthService.checkPermission(
        state,
        EntityType.POST,
        Operation.VIEW,
        post.id
      );
    }

    return post;
  }

  public async create(
    state: Context['state'],
    post: CreatePostInput
  ) {
    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.POST,
      Operation.ADD
    );

    return this.postDao.create(state.tx, post);
  }

  public async update(
    state: Context['state'],
    post: UpdatePostInput
  ) {
    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      post.id
    );

    return this.postDao.update(state.tx, post);
  }

  public async delete(
    state: Context['state'],
    post: DeletePostInput
  ) {
    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.POST,
      Operation.DELETE,
      post.id
    );

    return this.postDao.delete(state.tx, post);
  }
}
