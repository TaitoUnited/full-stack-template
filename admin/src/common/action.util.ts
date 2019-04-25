export const fetchActions = ['FETCH', 'RECEIVE', 'FAIL'];
export const saveActions = ['SAVE', 'RESULT', 'FAIL'];
export const binaryActions = ['SET', 'CLEAR'];
export const crudActions = [
  ...binaryActions,
  'RECEIVE',
  'FAIL',
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'LIST',
  'CREATE_FAIL',
  'READ_FAIL',
  'UPDATE_FAIL',
  'DELETE_FAIL',
  'LIST_FAIL',
  'GET_PDF',
];

export function createTypes(
  base: string,
  actionsArray: string[] = fetchActions
) {
  const res: { [x: string]: string } = {};
  actionsArray.forEach(type => {
    res[type] = `${base}_${type}`;
  });
  return res;
}
