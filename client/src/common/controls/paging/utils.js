export const getNumOfPages = (paging, results) => {
  const calculated = Math.max(
    1,
    Math.ceil(results.totalCount / paging.pageSize)
  );
  // Paging is always between 1-999
  return calculated;
};

export const prevFunc = (index, paging, onUpdatePaging, onSelectItem) => {
  if (index > 0) {
    // There is a previous item on current page
    return () => onSelectItem(index - 1);
  } else if (paging.page > 0) {
    // There is a previous page
    return () =>
      onUpdatePaging(
        'page',
        paging.page - 1, // Load the previous page first...
        paging.pageSize - 1 // ...and then select the last item
      );
  }
  return null;
};

export const nextFunc = (
  index,
  results,
  paging,
  onUpdatePaging,
  onSelectItem
) => {
  if (index < results.items.length - 1) {
    // There is a next item on current page
    return () => onSelectItem(index + 1);
  } else if (paging.page < getNumOfPages(paging, results) - 1) {
    // There is a next page
    return () =>
      onUpdatePaging(
        'page',
        paging.page + 1, // Load the next page first...
        0 // ...and then select the first item on page
      );
  }
  return null;
};
