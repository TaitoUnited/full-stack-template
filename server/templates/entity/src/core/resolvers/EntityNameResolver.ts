import { Context } from 'koa';
import Container, { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  Pagination,
  FilterGroup,
  Order,
  OrderDirection,
} from '../../common/types/search';
import { EntityId } from '../../common/types/entity';
import {
  EntityName,
  EntityNameFilter,
  PaginatedEntityNames,
  CreateEntityNameInput,
  UpdateEntityNameInput,
  DeleteEntityNameInput,
} from '../types/entityName';
import { EntityNameService } from '../services/EntityNameService';

/**
 * GraphQL resolver for EntityNames
 */
@Service()
@Resolver(() => EntityName)
class EntityNameResolver {
  constructor(
    private readonly entityNameService = Container.get(EntityNameService)
  ) {}

  // TODO: Remove this TODO once the generated implementation has been
  // reviewed according to https://github.com/TaitoUnited/bronto-cloud/blob/dev/scripts/taito/DEVELOPMENT.md#code-generation
  @Authorized()
  @Query(() => PaginatedEntityNames, { description: 'Searches entityNames.' })
  async entityNames(
    @Ctx() ctx: Context,
    @Arg('search', () => String, {
      defaultValue: null,
    })
    search: string,
    @Arg('filterGroups', () => [FilterGroup], {
      defaultValue: [],
    })
    filterGroups: FilterGroup<EntityNameFilter>[],
    @Arg('order', () => Order, {
      defaultValue: new Order('createdAt', OrderDirection.DESC),
    })
    order: Order,
    @Arg('pagination', () => Pagination, {
      defaultValue: new Pagination(0, 20),
    })
    pagination: Pagination
  ) {
    return await this.entityNameService.search(
      ctx.state,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  // TODO: Remove this TODO once the generated implementation has been
  // reviewed according to https://github.com/TaitoUnited/bronto-cloud/blob/dev/scripts/taito/DEVELOPMENT.md#code-generation
  @Authorized()
  @Query(() => EntityName, {
    description: 'Reads a entityName.',
    nullable: true,
  })
  async entityName(@Ctx() ctx: Context, @Arg('id', () => String) id: string) {
    return await this.entityNameService.read(ctx.state, id);
  }

  // TODO: Remove this TODO once the generated implementation has been
  // reviewed according to https://github.com/TaitoUnited/bronto-cloud/blob/dev/scripts/taito/DEVELOPMENT.md#code-generation
  @Authorized()
  @Mutation(() => EntityName, { description: 'Creates a new entityName.' })
  async createEntityName(
    @Ctx() ctx: Context,
    @Arg('input') input: CreateEntityNameInput
  ) {
    return await this.entityNameService.create(ctx.state, input);
  }

  // TODO: Remove this TODO once the generated implementation has been
  // reviewed according to https://github.com/TaitoUnited/bronto-cloud/blob/dev/scripts/taito/DEVELOPMENT.md#code-generation
  @Authorized()
  @Mutation(() => EntityName, { description: 'Updates a entityName.' })
  async updateEntityName(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdateEntityNameInput
  ) {
    return await this.entityNameService.update(ctx.state, input);
  }

  // TODO: Remove this TODO once the generated implementation has been
  // reviewed according to https://github.com/TaitoUnited/bronto-cloud/blob/dev/scripts/taito/DEVELOPMENT.md#code-generation
  @Authorized()
  @Mutation(() => EntityId, { description: 'Deletes a entityName.' })
  async deleteEntityName(
    @Ctx() ctx: Context,
    @Arg('input') input: DeleteEntityNameInput
  ) {
    return await this.entityNameService.delete(ctx.state, input);
  }

  // ------------------------------------------------------
  // Field resolvers for other entities
  // ------------------------------------------------------

  // EXAMPLE: reference to an another entity
  //
  // @Authorized()
  // @FieldResolver(() => AnotherEntity, { nullable: true })
  // @Relation<EntityName>('anotherEntityId')
  // async anotherEntity(@Ctx() ctx: Context, @Root() root: EntityName) {
  //   return root.anotherEntityId
  //     ? await this.anotherEntityService.read(ctx.state, root.anotherEntityId)
  //     : null;
  // }

  // EXAMPLE: reference to other entities
  //
  // @Authorized()
  // @FieldResolver(() => PaginatedOtherEntities)
  // async otherEntities(@Ctx() ctx: Context, @Root() root: EntityName) {
  //   let filterGroups: FilterGroup<AnotherEntityFilter>[] = [];
  //   filterGroups = addFilter(filterGroups, AnotherEntityFilter, 'entityNameId', root.id);
  //
  //   return await this.otherEntityService.search(
  //     ctx.state,
  //     null,
  //     filterGroups,
  //     new Order('createdAt'),
  //     null
  //   );
  // }
}
