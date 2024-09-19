import { Type } from '@sinclair/typebox';

import { ServerInstance } from '~/setup/server';
import * as organisationService from './organisation.service';

export async function organisationRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/organisations',
    preHandler: [server.ensureSession],
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
    handler: async (request) => {
      const organisations = await organisationService.getUserOrganisations(
        request.ctx.db,
        request.ctx.user?.id as string
      );

      return organisations.map(({ organisation }) => ({
        id: organisation.id,
        name: organisation.name,
      }));
    },
  });
}
