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
  author: Scalars['String'];
  content: Scalars['String'];
  subject: Scalars['String'];
};


export type DeletePostInput = {
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
  /** Deletes a post. */
  deletePost: EntityId;
  /** Updates a post. */
  updatePost: Post;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
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

export type Pagination = {
  limit: Scalars['Float'];
  offset: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  author: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostFilter = {
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Reads a post. */
  post?: Maybe<Post>;
  /** Searches posts. */
  posts: PaginatedPosts;
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

export type UpdatePostInput = {
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  subject?: Maybe<Scalars['String']>;
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
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'subject' | 'updatedAt'>
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

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'Post' }
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'subject' | 'updatedAt'>
  ) }
);

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'subject' | 'updatedAt'>
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
      & Pick<Post, 'author' | 'content' | 'createdAt' | 'id' | 'subject' | 'updatedAt'>
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
    subject
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
export const UpdatePostDocument = gql`
    mutation updatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    author
    content
    createdAt
    id
    subject
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
      subject
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
    deletePost(variables: DeletePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePostMutation>(DeletePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePost');
    },
    updatePost(variables: UpdatePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePostMutation>(UpdatePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePost');
    },
    post(variables: PostQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostQuery>(PostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'post');
    },
    posts(variables?: PostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostsQuery>(PostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'posts');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;