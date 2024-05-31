// eslint-disable-next-line
export const noop = () => {};

// eslint-disable-next-line
export const noopWithArgs = (...args: any[]) => {};

export function genId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
