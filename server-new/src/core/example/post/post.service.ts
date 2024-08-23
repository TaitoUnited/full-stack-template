import { User } from '../user/user.resolver';

const posts: { id: number; name: string; author: typeof User.$inferType }[] = [
  {
    id: 1,
    name: 'Post 1',
    author: { id: '1', firstName: 'User', lastName: 'One' },
  },
  {
    id: 2,
    name: 'Post 2',
    author: { id: '1', firstName: 'User', lastName: 'One' },
  },
];

export function getPosts(search?: string) {
  return search
    ? posts.filter((post) =>
        post.name.toLowerCase().includes(search.toLowerCase())
      )
    : posts;
}

export function getPost(id: number) {
  return posts.find((post) => post.id === id);
}

export function createPost(name: string) {
  const newPost = {
    id: posts.length + 1,
    name,
    author: { id: '1', firstName: 'User', lastName: 'One' },
  };

  posts.push(newPost);

  return newPost;
}
