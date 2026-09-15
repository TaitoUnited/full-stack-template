import { builder } from '~/setup/graphql/builder';

export const User = builder.simpleObject('User', {
  fields: (t) => ({
    id: t.string(),
    name: t.string(),
    email: t.string(),
  }),
});
