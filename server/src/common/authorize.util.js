import _ from 'lodash';

/**
 * USAGE: authorize(state).role(role).department(department);
 */
const authorize = state => {
  const funcs = {};

  funcs.role = (...roles) => {
    if (!_.includes(roles, state.user.role)) {
      console.log('auth.role failed');
      const ex = {
        type: 'authorization',
        message: 'user does not have any of the roles: ...',
        state,
      };
      throw ex;
    }
    return funcs;
  };

  funcs.equals = (name, value1, value2) => {
    if (value1 !== value2) {
      console.log('auth.eq failed');
      const ex = {
        type: 'authorization',
        message: `${name} value mismatch: ${value1} !== ${value2}`,
        state,
      };
      throw ex;
    }
    return funcs;
  };

  return funcs;
};

export default authorize;
