// This is an example of an authMiddleware

// import { GraphQLError } from 'graphql';
// import { Context } from 'koa';
// import Container from 'typedi';
// import { AdminDao } from '../core/daos/AdminDao';

// const adminDao = Container.get(AdminDao);

// export default async function authMiddleware(
//   ctx: Context,
//   next: () => Promise<void>
// ) {
//   // Check that admin exists
//   if (ctx.state?.user?.id && ctx.state.user?.role === 'admin') {
//     const admin = await adminDao.read(ctx.state.tx, ctx.state.user.id);

//     if (!admin) {
//       throw new GraphQLError('Not authorized', {
//         extensions: {
//           code: 'UNAUTHENTICATED',
//         },
//       });
//     }
//   }

//   await next();
// }
