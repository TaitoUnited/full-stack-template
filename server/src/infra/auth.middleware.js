import { mergeToLogCtx } from '../common/log.util';

const authMiddleware = async (ctx, next) => {
  // Determine user details
  // NOTE: Using hard-coded user (no auth implemented).
  const user = {
    id: '1234-1234-1234-1234',
    role: 'admin',
  };

  // Add user to state
  ctx.state.user = user;

  // Log minimal user details
  // NOTE: Do not log any personally identifiable information (GDPR)
  mergeToLogCtx({
    user: {
      id: user.id,
      role: user.role,
    },
  });

  await next();
};

export default authMiddleware;
