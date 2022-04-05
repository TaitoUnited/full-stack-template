import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from './hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export type Attachment = {
  __typename?: 'Attachment';
  contentType: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  fileUrl?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type AttachmentFilter = {
  attachmentType: Scalars['String'];
  contentType: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  filename: Scalars['String'];
  postId: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type AttachmentUploadRequestDetails = {
  __typename?: 'AttachmentUploadRequestDetails';
  headers: Array<KeyValue>;
  id: Scalars['String'];
  url: Scalars['String'];
};

export type CreateAttachmentInput = {
  contentType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CreateAttachmentInputBase = {
  contentType: Scalars['String'];
  filename?: Maybe<Scalars['String']>;
};

export type CreatePostAttachmentInput = {
  contentType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  postId: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type CreatePostInput = {
  author: Scalars['String'];
  content: Scalars['String'];
  subject: Scalars['String'];
};

export type DeleteAttachmentInput = {
  id: Scalars['String'];
};

export type DeletePostAttachmentInput = {
  id: Scalars['String'];
  postId: Scalars['String'];
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

export type FinalizePostAttachmentInput = {
  id: Scalars['String'];
  postId: Scalars['String'];
};

export type KeyValue = {
  __typename?: 'KeyValue';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new post. */
  createPost: Post;
  /**
   * Creates a new attachment for post.
   * Returns URL and HTTP headers that should be used to upload the file using HTTP PUT.
   */
  createPostAttachment: AttachmentUploadRequestDetails;
  /** Deletes a post. */
  deletePost: EntityId;
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
  dir?: Maybe<OrderDirection>;
  field: Scalars['String'];
  /** Determines whether NULL values are ordered first or last. */
  invertNullOrder?: Maybe<Scalars['Boolean']>;
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginatedAttachments = {
  __typename?: 'PaginatedAttachments';
  data: Array<Attachment>;
  total: Scalars['Float'];
};

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
  attachments: PaginatedAttachments;
  author: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};


export type PostAttachmentsArgs = {
  attachmentOrder?: Maybe<Order>;
};

export type PostFilter = {
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Returns all MIME types allowed for post attachments. */
  allowedPostAttachmentMimeTypes: Array<Scalars['String']>;
  /** Reads a post. */
  post?: Maybe<Post>;
  /** Reads a post attachment. */
  postAttachment?: Maybe<Attachment>;
  /** Searches posts. */
  posts: PaginatedPosts;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryPostAttachmentArgs = {
  input: ReadPostAttachmentInput;
};


export type QueryPostsArgs = {
  filterGroups?: Maybe<Array<FilterGroup>>;
  order?: Maybe<Order>;
  pagination?: Maybe<Pagination>;
  search?: Maybe<Scalars['String']>;
};

export type ReadPostAttachmentInput = {
  id: Scalars['String'];
  postId: Scalars['String'];
};

export type RequestDetails = {
  __typename?: 'RequestDetails';
  headers: Array<KeyValue>;
  url: Scalars['String'];
};

export type UpdateAttachmentInput = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type UpdateAttachmentInputBase = {
  id: Scalars['String'];
};

export type UpdatePostAttachmentInput = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  postId: Scalars['String'];
  title?: Maybe<Scalars['String']>;
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
  subject: Scalars['String'];
  author: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: string } };

export type PostListQueryVariables = Exact<{ [key: string]: never; }>;


export type PostListQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', total: number, data: Array<{ __typename?: 'Post', id: string, subject: string, createdAt: any }> } };

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostQuery = { __typename?: 'Query', post?: Maybe<{ __typename?: 'Post', id: string, createdAt: any, author: string, subject: string, content: string }> };


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
    query PostList {
  posts {
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
export type PostListQueryHookResult = ReturnType<typeof usePostListQuery>;
export type PostListLazyQueryHookResult = ReturnType<typeof usePostListLazyQuery>;
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
export function usePostQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PostQuery, PostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
      }
export function usePostLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;