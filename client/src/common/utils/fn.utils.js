// NOTE: This is just an example
const times = timesArg => {
  return func => {
    return Array(timesArg)
      .fill('-')
      .map((_, index) => {
        return func(index);
      });
  };
};

const example = null;

export default { times, example };
