import { builder } from '~/setup/graphql/builder';
import { organisationService } from './organisation.service';

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
        return organisationService.getOrganisation(ctx, args.id);
      },
    })
  );

  builder.queryField('organisations', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Organisation],
      nullable: true,
      resolve: async (_, __, ctx) => {
        const organisations = await organisationService.getUserOrganisations(
          ctx,
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
