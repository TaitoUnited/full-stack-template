import type Bunyan from 'bunyan';
import { fastifyPlugin } from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

import { DrizzleDb, getDb } from '~/db';
import { Authenticator, getAuth, Session } from '~/src/utils/authentication';
import { Role } from '~/src/utils/authorisation';
import { log } from '~/src/utils/log';
import { getStringHeader } from '~/src/utils/request';
import { AuthenticatedGraphQLContext } from './graphql/types';
import { AuthenticatedRestContext } from './rest/types';
import { type ServerInstance } from './server';

export type Initiator =
  | 'graphql'
  | 'rest'
  | 'management-api'
  | 'test'
  | 'seed'
  | 'unknown';

export type Context = {
  log: Bunyan;
  db: DrizzleDb;
  auth: Authenticator;
  requestId: string;
  organisationId: null | string; // from request header 'x-organisation-id'
  initiator: Initiator; // for operation logging and error throwing
  __authenticator__: string | null;
  error: Error | null;

  // Populated in authPlugin, after authentication
  user: null | { id: string; session?: Session };

  userOrganisations: { id: string; role: Role }[];
};

/** Context that has been authenticated (includes user and session), regardless of origin. */
export type AuthenticatedContext =
  | AuthenticatedRestContext
  | AuthenticatedGraphQLContext;

export const contextPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('onRequest', async (request) => {
    request.ctx = request.ctx || {};
    request.ctx.log = log;
    const db = await getDb();
    request.ctx.db = db;
    request.ctx.auth = getAuth(db);
    request.ctx.requestId = uuidv4();
    request.ctx.organisationId = getStringHeader(request, 'x-organisation-id');
    request.ctx.initiator = 'rest';

    // These will be populated by the auth plugin
    request.ctx.user = null;
    request.ctx.userOrganisations = [];
  });
});

// export async function getContextUserDetails(
//   db: DrizzleDb,
//   options: { userId: string; workspaceId: string | null }
// ) {
//   const { userId, workspaceId } = options;
//   const [userCompanyRoles, userWorkspaces, userAgreements, user] =
//     await Promise.all([
//       companyService.getUserCompaniesWithRoles(db, { userId }),
//       workspaceService.getUserWorkspaces(db, { userId }),
//       workspaceService.getUserAgreements(db, userId),
//       userService.getUser(db, userId),
//     ]);

//   // Shouldn't ever happen
//   if (!user) {
//     throwApiError({
//       errorType: 'internal',
//       initiator: 'unknown',
//       message: 'User not found',
//     });
//   }

//   const userGlobalSystemRoles = user!.globalRoles.filter(isValidSystemRole);
//   const userGlobalWorkspaceRoles =
//     user!.globalRoles.filter(isValidWorkspaceRole);

//   /* If user has global workspace roles and user is not a member of the current selected workspace,
//   treat user as member of the workspace */
//   if (
//     workspaceId &&
//     userGlobalWorkspaceRoles.length > 0 &&
//     !userWorkspaces.some((workspace) => workspace.id === workspaceId)
//   ) {
//     const workspace = await workspaceService.getWorkspace(db, {
//       id: workspaceId,
//     });
//     userWorkspaces.push({
//       ...workspace!,
//       roles: userGlobalWorkspaceRoles,
//     });
//   }

//   // All workspaces the user has permissions for (is a member of and/or has agreements for)
//   const workspacePermissions = determineWorkspacePermissions({
//     userWorkspaces,
//     userAgreements,
//   });

//   const workspaceFeatures = Object.fromEntries(
//     userWorkspaces.map((workspace) => [workspace.id, workspace.features])
//   );

//   return {
//     user: {
//       id: userId,
//     },
//     userCompanies: userCompanyRoles.map((companyRole) => ({
//       id: companyRole.companyId,
//       role: companyRole.role,
//     })),
//     userWorkspaces,
//     userAgreementWorkspaces: userAgreements.map((agreement) => ({
//       id: agreement.targetWorkspaceId,
//     })),
//     workspacePermissions,
//     workspaceFeatures,
//     globalPermissions: {
//       system: uniq(
//         userGlobalSystemRoles.flatMap(
//           (role) => SYSTEM_ROLE_PERMISSION_MAPPING[role]
//         )
//       ),
//       workspace: uniq(
//         userGlobalWorkspaceRoles.flatMap(
//           (role) => WORKSPACE_ROLE_PERMISSION_MAPPING[role]
//         )
//       ),
//     },
//   };
// }
