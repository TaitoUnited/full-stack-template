import _ from 'lodash';
import Boom from 'boom';

/**
 * USAGE: authorize(state).role(role).department(department)...;
 */
const authorize = state => {
  const authorizer = {};

  authorizer.role = (...roles) => {
    if (!state.user || !state.user.role) {
      throw Boom.unauthorized('User not logged in');
    } else if (!_.includes(roles, state.user.role)) {
      throw Boom.forbidden('No required role');
    }
    return authorizer;
  };

  authorizer.equals = (name, value1, value2) => {
    if (value1 !== value2) {
      throw Boom.forbidden('TODO message...');
    }
    return authorizer;
  };

  return authorizer;
};

export default authorize;
