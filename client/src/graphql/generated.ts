import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from './hooks';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any; }
};

export type Attachment = {
  __typename?: 'Attachment';
  contentType: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AttachmentFilter = {
  attachmentType: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  id: Scalars['String']['input'];
  postId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  updatedAt: Scalars['DateTime']['input'];
};

export type AttachmentUploadRequestDetails = {
  __typename?: 'AttachmentUploadRequestDetails';
  headers: Array<KeyValue>;
  id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CreateAttachmentInput = {
  contentType: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAttachmentInputBase = {
  contentType: Scalars['String']['input'];
  filename?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostAttachmentInput = {
  contentType: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePostInput = {
  author: Scalars['String']['input'];
  content: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type DeleteAttachmentInput = {
  id: Scalars['String']['input'];
};

export type DeletePostAttachmentInput = {
  id: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};

export type DeletePostInput = {
  id: Scalars['String']['input'];
};

export type Filter = {
  field: Scalars['String']['input'];
  operator: FilterOperator;
  value?: InputMaybe<Scalars['String']['input']>;
  /** Determines how the value is treated */
  valueType?: ValueType;
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

export type FinalizePostAttachmentInput = {
  id: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};

export type KeyValue = {
  __typename?: 'KeyValue';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new post. */
  createPost: Post;
  /**
   *
   *       Creates a new attachment for post.
   *       Returns URL and HTTP headers that should be used to upload the file using HTTP PUT.
   *
   */
  createPostAttachment: AttachmentUploadRequestDetails;
  /** Deletes a post. */
  deletePost: Post;
  /** Deletes post attachment. Returns attachment that was deleted. */
  deletePostAttachment: Attachment;
  /** Finalizes uploaded post attachment. Call this after successful HTTP PUT upload. */
  finalizePostAttachment: Attachment;
  /** Updates a post. */
  updatePost: Post;
  /** Updates post attachment. */
  updatePostAttachment: Attachment;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreatePostAttachmentArgs = {
  input: CreatePostAttachmentInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationDeletePostAttachmentArgs = {
  input: DeletePostAttachmentInput;
};


export type MutationFinalizePostAttachmentArgs = {
  input: FinalizePostAttachmentInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdatePostAttachmentArgs = {
  input: UpdatePostAttachmentInput;
};

export type Order = {
  /** Determines whether to sort ascending or descending. */
  dir?: OrderDirection;
  field: Scalars['String']['input'];
  /** Determines whether NULL values are ordered first or last. */
  invertNullOrder?: Scalars['Boolean']['input'];
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginatedAttachments = {
  __typename?: 'PaginatedAttachments';
  data: Array<Attachment>;
  total: Scalars['Float']['output'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  data: Array<Post>;
  total: Scalars['Float']['output'];
};

export type Pagination = {
  limit: Scalars['Float']['input'];
  offset: Scalars['Float']['input'];
};

export type Post = {
  __typename?: 'Post';
  attachments: PaginatedAttachments;
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  subject: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type PostAttachmentsArgs = {
  attachmentOrder?: InputMaybe<Order>;
};

export type PostFilter = {
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['String']['input'];
  updatedAt: Scalars['DateTime']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Returns all MIME types allowed for post attachments. */
  allowedPostAttachmentMimeTypes: Array<Scalars['String']['output']>;
  /** Reads a post. */
  post: Post;
  /** Reads a post attachment. */
  postAttachment: Attachment;
  /** Searches posts. */
  posts: PaginatedPosts;
};


export type QueryPostArgs = {
  id: Scalars['String']['input'];
};


export type QueryPostAttachmentArgs = {
  input: ReadPostAttachmentInput;
};


export type QueryPostsArgs = {
  filterGroups?: Array<FilterGroup>;
  order?: Order;
  pagination?: Pagination;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ReadPostAttachmentInput = {
  id: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};

export type RequestDetails = {
  __typename?: 'RequestDetails';
  headers: Array<KeyValue>;
  url: Scalars['String']['output'];
};

export type UpdateAttachmentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttachmentInputBase = {
  id: Scalars['String']['input'];
};

export type UpdatePostAttachmentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  postId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  subject?: InputMaybe<Scalars['String']['input']>;
};

export enum ValueType {
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type CreatePostMutationVariables = Exact<{
  subject: Scalars['String']['input'];
  author: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: string } };

export type PostListQueryVariables = Exact<{
  order?: InputMaybe<Order>;
  pagination?: InputMaybe<Pagination>;
}>;


export type PostListQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', total: number, data: Array<{ __typename?: 'Post', id: string, subject: string, createdAt: any }> } };

export type PostQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', id: string, createdAt: any, author: string, subject: string, content: string } };


export const CreatePostDocument = gql`
    mutation CreatePost($subject: String!, $author: String!, $content: String!) {
  createPost(input: {subject: $subject, author: $author, content: $content}) {
    id
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      subject: // value for 'subject'
 *      author: // value for 'author'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const PostListDocument = gql`
    query PostList($order: Order, $pagination: Pagination) {
  posts(order: $order, pagination: $pagination) {
    total
    data {
      id
      subject
      createdAt
    }
  }
}
    `;

/**
 * __usePostListQuery__
 *
 * To run a query within a React component, call `usePostListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostListQuery({
 *   variables: {
 *      order: // value for 'order'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function usePostListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PostListQuery, PostListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PostListQuery, PostListQueryVariables>(PostListDocument, options);
      }
export function usePostListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PostListQuery, PostListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PostListQuery, PostListQueryVariables>(PostListDocument, options);
        }
export function usePostListSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<PostListQuery, PostListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PostListQuery, PostListQueryVariables>(PostListDocument, options);
        }
export type PostListQueryHookResult = ReturnType<typeof usePostListQuery>;
export type PostListLazyQueryHookResult = ReturnType<typeof usePostListLazyQuery>;
export type PostListSuspenseQueryHookResult = ReturnType<typeof usePostListSuspenseQuery>;
export type PostListQueryResult = Apollo.QueryResult<PostListQuery, PostListQueryVariables>;
export const PostDocument = gql`
    query Post($id: String!) {
  post(id: $id) {
    id
    createdAt
    author
    subject
    content
  }
}
    `;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PostQuery, PostQueryVariables> & ({ variables: PostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
      }
export function usePostLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export function usePostSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostSuspenseQueryHookResult = ReturnType<typeof usePostSuspenseQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;