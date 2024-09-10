import { builder } from '~/setup/graphql/builder';
import { GraphQLError } from '~/utils/error';
import * as organisationService from './organisation.service';

const Organisation = builder.simpleObject('Organisation', {
  fields: (t) => ({
    id: t.string(),
    name: t.string(),
  }),
});

export function setupResolvers() {
  builder.queryField('organisation', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Organisation,
      nullable: true,
      args: { id: t.arg.string() },
      resolve: async (_, args, ctx) => {
        if (!ctx.userOrganisations.some((org) => org.id === args.id)) {
          throw GraphQLError.forbidden(
            'You do not have access to this organisation'
          );
        }

        return organisationService.getOrganisation(ctx.db, args.id);
      },
    })
  );

  builder.queryField('organisations', (t) =>
    t.withAuth({ session: true }).field({
      type: [Organisation],
      nullable: true,
      resolve: async (_, __, ctx) => {
        const organisations = await organisationService.getUserOrganisations(
          ctx.db,
          ctx.user.id
        );

        return organisations.map(({ organisation }) => ({
          id: organisation.id,
          name: organisation.name,
        }));
      },
    })
  );
}
