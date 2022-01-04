import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CreatePostInput = {
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  moderatorId?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  externalIds?: Maybe<Array<Scalars['String']>>;
  firstName: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
};


export type DeletePostInput = {
  id: Scalars['String'];
};

export type DeleteUserInput = {
  id: Scalars['String'];
};

export type EntityId = {
  __typename?: 'EntityId';
  id: Scalars['String'];
};

export type Filter = {
  field: Scalars['String'];
  operator: FilterOperator;
  value: Scalars['String'];
  /** Determines how the value is treated */
  valueType?: Maybe<ValueType>;
};

export type FilterGroup = {
  filters: Array<Filter>;
  operator: FilterLogicalOperator;
};

export enum FilterLogicalOperator {
  And = 'AND',
  Or = 'OR'
}

export enum FilterOperator {
  Eq = 'EQ',
  Gt = 'GT',
  Gte = 'GTE',
  Ilike = 'ILIKE',
  Like = 'LIKE',
  Lt = 'LT',
  Lte = 'LTE',
  Neq = 'NEQ'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new post. */
  createPost: Post;
  /** Creates a new user. */
  createUser: User;
  /** Deletes a post. */
  deletePost: EntityId;
  /** Deletes a user. */
  deleteUser: EntityId;
  /** Updates a post. */
  updatePost: Post;
  /** Updates a user. */
  updateUser: User;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Order = {
  dir: OrderDirection;
  field: Scalars['String'];
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  data: Array<Post>;
  total: Scalars['Float'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  data: Array<User>;
  total: Scalars['Float'];
};

export type Pagination = {
  limit: Scalars['Float'];
  offset: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  moderator?: Maybe<User>;
  moderatorId?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type PostFilter = {
  author: Scalars['String'];
  createdAt: Scalars['DateTime'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Reads a post. */
  post?: Maybe<Post>;
  /** Searches posts. */
  posts: PaginatedPosts;
  /** Reads a user. */
  user?: Maybe<User>;
  /** Search users. */
  users: PaginatedUsers;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryPostsArgs = {
  filterGroups?: Maybe<Array<FilterGroup>>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
  search?: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  filterGroups?: Maybe<Array<FilterGroup>>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
  search?: Maybe<Scalars['String']>;
};

export type UpdatePostInput = {
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  moderatorId?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  email?: Maybe<Scalars['String']>;
  externalIds?: Maybe<Array<Scalars['String']>>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type UserFilter = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export enum ValueType {
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'moderatorId' | 'subject' | 'updatedAt'>
    & { moderator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
    )> }
  ) }
);

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
  ) }
);

export type DeletePostMutationVariables = Exact<{
  input: DeletePostInput;
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & { deletePost: (
    { __typename?: 'EntityId' }
    & Pick<EntityId, 'id'>
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  input: DeleteUserInput;
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'EntityId' }
    & Pick<EntityId, 'id'>
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'Post' }
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'moderatorId' | 'subject' | 'updatedAt'>
    & { moderator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
    )> }
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
  ) }
);

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'moderatorId' | 'subject' | 'updatedAt'>
    & { moderator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
    )> }
  )> }
);

export type PostsQueryVariables = Exact<{
  filterGroups?: Maybe<Array<FilterGroup> | FilterGroup>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
  search?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'total'>
    & { data: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'moderatorId' | 'subject' | 'updatedAt'>
      & { moderator?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
      )> }
    )> }
  ) }
);

export type UserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
  )> }
);

export type UsersQueryVariables = Exact<{
  filterGroups?: Maybe<Array<FilterGroup> | FilterGroup>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
  search?: Maybe<Scalars['String']>;
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'PaginatedUsers' }
    & Pick<PaginatedUsers, 'total'>
    & { data: Array<(
      { __typename?: 'User' }
      & Pick<User, 'createdAt' | 'email' | 'firstName' | 'id' | 'language' | 'lastName' | 'updatedAt'>
    )> }
  ) }
);


export const CreatePostDocument = gql`
    mutation createPost($input: CreatePostInput!) {
  createPost(input: $input) {
    author
    content
    createdAt
    id
    moderator {
      createdAt
      email
      firstName
      id
      language
      lastName
      updatedAt
    }
    moderatorId
    subject
    updatedAt
  }
}
    `;
export const CreateUserDocument = gql`
    mutation createUser($input: CreateUserInput!) {
  createUser(input: $input) {
    createdAt
    email
    firstName
    id
    language
    lastName
    updatedAt
  }
}
    `;
export const DeletePostDocument = gql`
    mutation deletePost($input: DeletePostInput!) {
  deletePost(input: $input) {
    id
  }
}
    `;
export const DeleteUserDocument = gql`
    mutation deleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
  }
}
    `;
export const UpdatePostDocument = gql`
    mutation updatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    author
    content
    createdAt
    id
    moderator {
      createdAt
      email
      firstName
      id
      language
      lastName
      updatedAt
    }
    moderatorId
    subject
    updatedAt
  }
}
    `;
export const UpdateUserDocument = gql`
    mutation updateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    createdAt
    email
    firstName
    id
    language
    lastName
    updatedAt
  }
}
    `;
export const PostDocument = gql`
    query post($id: String!) {
  post(id: $id) {
    author
    content
    createdAt
    id
    moderator {
      createdAt
      email
      firstName
      id
      language
      lastName
      updatedAt
    }
    moderatorId
    subject
    updatedAt
  }
}
    `;
export const PostsDocument = gql`
    query posts($filterGroups: [FilterGroup!], $order: Order, $pagination: Pagination, $search: String) {
  posts(
    filterGroups: $filterGroups
    order: $order
    pagination: $pagination
    search: $search
  ) {
    data {
      author
      content
      createdAt
      id
      moderator {
        createdAt
        email
        firstName
        id
        language
        lastName
        updatedAt
      }
      moderatorId
      subject
      updatedAt
    }
    total
  }
}
    `;
export const UserDocument = gql`
    query user($id: String!) {
  user(id: $id) {
    createdAt
    email
    firstName
    id
    language
    lastName
    updatedAt
  }
}
    `;
export const UsersDocument = gql`
    query users($filterGroups: [FilterGroup!], $order: Order, $pagination: Pagination, $search: String) {
  users(
    filterGroups: $filterGroups
    order: $order
    pagination: $pagination
    search: $search
  ) {
    data {
      createdAt
      email
      firstName
      id
      language
      lastName
      updatedAt
    }
    total
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createPost(variables: CreatePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePostMutation>(CreatePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPost');
    },
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser');
    },
    deletePost(variables: DeletePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePostMutation>(DeletePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePost');
    },
    deleteUser(variables: DeleteUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteUserMutation>(DeleteUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteUser');
    },
    updatePost(variables: UpdatePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePostMutation>(UpdatePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePost');
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUser');
    },
    post(variables: PostQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostQuery>(PostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'post');
    },
    posts(variables?: PostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostsQuery>(PostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'posts');
    },
    user(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserQuery>(UserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'user');
    },
    users(variables?: UsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UsersQuery>(UsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'users');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;