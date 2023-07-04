const todo = () => {
  console.log('TODO: implement worker');
  setTimeout(todo, 5 * 60000);
};

todo();

export {};
