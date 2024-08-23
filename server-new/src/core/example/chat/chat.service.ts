import { User } from '../user/user.resolver';

const messages: {
  id: number;
  message: string;
  user: typeof User.$inferType;
}[] = [
  {
    id: 1,
    message: 'Message 1',
    user: {
      id: '1',
      firstName: 'User',
      lastName: 'One',
    },
  },
];

export function getMessages() {
  return messages;
}
