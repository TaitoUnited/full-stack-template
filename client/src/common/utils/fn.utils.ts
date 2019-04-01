// NOTE: This is just an example
export const times = (timesArg: number) => {
  return (func: Function) => {
    return Array(timesArg)
      .fill('-')
      .map((_, index) => {
        return func(index);
      });
  };
};
