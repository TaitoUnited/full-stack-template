const users: { id: number; firstName: string; lastName: string }[] = [
  { id: 1, firstName: 'User', lastName: 'One' },
  { id: 2, firstName: 'User', lastName: 'Two' },
];

export function getUsers(search?: string) {
  return search
    ? users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())
      )
    : users;
}

export function getUser(id: number) {
  return users.find((user) => user.id === id);
}
