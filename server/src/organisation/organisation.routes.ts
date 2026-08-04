/* oxlint-disable typescript/no-unnecessary-condition */

import { Type } from '@sinclair/typebox';

import { withUser } from '~/setup/auth';
import type { ServerInstance } from '~/setup/server';
import { organisationService } from './organisation.service';

export function organisationRoutes(server: ServerInstance) {
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
    handler: withUser(async (request) => {
      const organisations = await organisationService.getUserOrganisations(
        request.ctx,
        request.ctx.user?.id
      );

      return organisations.map(({ organisation }) => ({
        id: organisation.id,
        name: organisation.name,
      }));
    }),
  });
}
