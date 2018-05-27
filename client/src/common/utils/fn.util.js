// NOTE: Just an example
export const times = timesArg => {
  return func => {
    return Array(timesArg)
      .fill('-')
      .map((_, index) => {
        return func(index);
      });
  };
};

export const example = null;
