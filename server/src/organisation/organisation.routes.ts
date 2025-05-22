import { Type } from '@sinclair/typebox';

import { withAuth } from '~/setup/auth';
import { ServerInstance } from '~/setup/server';
import { organisationController } from './organisation.controller';

export async function organisationRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/organisations',
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
          })
        ),
      },
    },
    handler: withAuth(async (request) => {
      const organisations = await organisationController.getUserOrganisations(
        request.ctx,
        request.ctx.user?.id as string
      );

      return organisations.map(({ organisation }) => ({
        id: organisation.id,
        name: organisation.name,
      }));
    }),
  });
}
