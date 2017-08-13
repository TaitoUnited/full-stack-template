/**
 * USAGE: validate(name, value).required().date().future();
 */
export const validate = (name, value) => {
  const funcs = {};

  funcs.required = () => {
    if (!value) {
      const ex = {
        type: 'validation',
        cause: 'missing',
        message: '${name} is required',
        name,
        value,
      };
      throw ex;
    }
    return funcs;
  };

  funcs.maxlength = () => {
    // TODO validate
    return funcs;
  };

  funcs.date = () => {
    // TODO validate
    return funcs;
  };

  funcs.future = () => {
    // TODO validate
    return funcs;
  };

  funcs.past = () => {
    // TODO validate
    return funcs;
  };

  funcs.found = () => {
    if (!value) {
      const ex = {
        type: 'validation',
        cause: 'notfound',
        message: '${name} not found',
        name,
        value,
      };
      throw ex;
    }
    return funcs;
  };

  return funcs;
};
