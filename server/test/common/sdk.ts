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


export type Filter = {
  field: Scalars['String'];
  type: FilterType;
  value: Scalars['String'];
  /** Determines how the value is treated */
  valueType?: Maybe<ValueType>;
};

export enum FilterType {
  Exact = 'EXACT',
  Like = 'LIKE'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new post. */
  createPost: Post;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
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
  id: Scalars['String'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Returns posts. */
  posts: PaginatedPosts;
};


export type QueryPostsArgs = {
  filters?: Maybe<Array<Filter>>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
};

export enum ValueType {
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type ReadPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReadPostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'total'>
    & { data: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'subject' | 'content' | 'author'>
    )> }
  ) }
);

export type CreatePostMutationVariables = Exact<{
  subject: Scalars['String'];
  content: Scalars['String'];
  author: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'subject' | 'content' | 'author'>
  ) }
);


export const ReadPostsDocument = gql`
    query readPosts {
  posts {
    total
    data {
      id
      subject
      content
      author
    }
  }
}
    `;
export const CreatePostDocument = gql`
    mutation createPost($subject: String!, $content: String!, $author: String!) {
  createPost(input: {subject: $subject, content: $content, author: $author}) {
    id
    subject
    content
    author
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    readPosts(variables?: ReadPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ReadPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReadPostsQuery>(ReadPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'readPosts');
    },
    createPost(variables: CreatePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePostMutation>(CreatePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPost');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;