import _ from 'lodash';
import Boom from 'boom';

/**
 * USAGE: authorize(state).role(role).department(department)...;
 */
const authorize = state => {
  const funcs = {};

  funcs.role = (...roles) => {
    if (!state.role) {
      throw Boom.unauthorized('User not logged in');
    } else if (!_.includes(roles, state.role)) {
      throw Boom.forbidden('No required role');
    }
    return funcs;
  };

  funcs.equals = (name, value1, value2) => {
    if (value1 !== value2) {
      throw Boom.forbidden('TODO message...');
    }
    return funcs;
  };

  return funcs;
};

export default authorize;
