import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  id: Scalars['String'];
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
  description?: InputMaybe<Scalars['String']>;
  filename?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateAttachmentInputBase = {
  contentType: Scalars['String'];
  filename?: InputMaybe<Scalars['String']>;
};

export type CreatePostAttachmentInput = {
  contentType: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  filename?: InputMaybe<Scalars['String']>;
  postId: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
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

export type Filter = {
  field: Scalars['String'];
  operator: FilterOperator;
  value?: InputMaybe<Scalars['String']>;
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
  field: Scalars['String'];
  /** Determines whether NULL values are ordered first or last. */
  invertNullOrder?: Scalars['Boolean'];
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
  attachmentOrder?: InputMaybe<Order>;
};

export type PostFilter = {
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Returns all MIME types allowed for post attachments. */
  allowedPostAttachmentMimeTypes: Array<Scalars['String']>;
  /** Reads a post. */
  post: Post;
  /** Reads a post attachment. */
  postAttachment: Attachment;
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
  filterGroups?: Array<FilterGroup>;
  order?: Order;
  pagination?: Pagination;
  search?: InputMaybe<Scalars['String']>;
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
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateAttachmentInputBase = {
  id: Scalars['String'];
};

export type UpdatePostAttachmentInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  postId: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type UpdatePostInput = {
  author?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  subject?: InputMaybe<Scalars['String']>;
};

export enum ValueType {
  Date = 'DATE',
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
  attachmentOrder?: InputMaybe<Order>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', author: string, content: string, createdAt: any, id: string, subject: string, updatedAt: any, attachments: { __typename?: 'PaginatedAttachments', total: number } } };

export type CreatePostAttachmentMutationVariables = Exact<{
  input: CreatePostAttachmentInput;
}>;


export type CreatePostAttachmentMutation = { __typename?: 'Mutation', createPostAttachment: { __typename?: 'AttachmentUploadRequestDetails', id: string, url: string, headers: Array<{ __typename?: 'KeyValue', key: string, value: string }> } };

export type DeletePostMutationVariables = Exact<{
  input: DeletePostInput;
  attachmentOrder?: InputMaybe<Order>;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'Post', author: string, content: string, createdAt: any, id: string, subject: string, updatedAt: any, attachments: { __typename?: 'PaginatedAttachments', total: number } } };

export type DeletePostAttachmentMutationVariables = Exact<{
  input: DeletePostAttachmentInput;
}>;


export type DeletePostAttachmentMutation = { __typename?: 'Mutation', deletePostAttachment: { __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any } };

export type FinalizePostAttachmentMutationVariables = Exact<{
  input: FinalizePostAttachmentInput;
}>;


export type FinalizePostAttachmentMutation = { __typename?: 'Mutation', finalizePostAttachment: { __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any } };

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
  attachmentOrder?: InputMaybe<Order>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'Post', author: string, content: string, createdAt: any, id: string, subject: string, updatedAt: any, attachments: { __typename?: 'PaginatedAttachments', total: number } } };

export type UpdatePostAttachmentMutationVariables = Exact<{
  input: UpdatePostAttachmentInput;
}>;


export type UpdatePostAttachmentMutation = { __typename?: 'Mutation', updatePostAttachment: { __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any } };

export type AllowedPostAttachmentMimeTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllowedPostAttachmentMimeTypesQuery = { __typename?: 'Query', allowedPostAttachmentMimeTypes: Array<string> };

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
  attachmentOrder?: InputMaybe<Order>;
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', author: string, content: string, createdAt: any, id: string, subject: string, updatedAt: any, attachments: { __typename?: 'PaginatedAttachments', total: number, data: Array<{ __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any }> } } };

export type PostAttachmentQueryVariables = Exact<{
  input: ReadPostAttachmentInput;
}>;


export type PostAttachmentQuery = { __typename?: 'Query', postAttachment: { __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any } };

export type PostsQueryVariables = Exact<{
  filterGroups: Array<FilterGroup> | FilterGroup;
  order: Order;
  pagination: Pagination;
  search?: InputMaybe<Scalars['String']>;
  attachmentOrder?: InputMaybe<Order>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', total: number, data: Array<{ __typename?: 'Post', author: string, content: string, createdAt: any, id: string, subject: string, updatedAt: any, attachments: { __typename?: 'PaginatedAttachments', total: number, data: Array<{ __typename?: 'Attachment', contentType: string, createdAt: any, description?: string | null | undefined, fileUrl?: string | null | undefined, filename?: string | null | undefined, id: string, title?: string | null | undefined, updatedAt: any }> } }> } };


export const CreatePostDocument = gql`
    mutation createPost($input: CreatePostInput!, $attachmentOrder: Order) {
  createPost(input: $input) {
    attachments(attachmentOrder: $attachmentOrder) {
      total
    }
    author
    content
    createdAt
    id
    subject
    updatedAt
  }
}
    `;
export const CreatePostAttachmentDocument = gql`
    mutation createPostAttachment($input: CreatePostAttachmentInput!) {
  createPostAttachment(input: $input) {
    headers {
      key
      value
    }
    id
    url
  }
}
    `;
export const DeletePostDocument = gql`
    mutation deletePost($input: DeletePostInput!, $attachmentOrder: Order) {
  deletePost(input: $input) {
    attachments(attachmentOrder: $attachmentOrder) {
      total
    }
    author
    content
    createdAt
    id
    subject
    updatedAt
  }
}
    `;
export const DeletePostAttachmentDocument = gql`
    mutation deletePostAttachment($input: DeletePostAttachmentInput!) {
  deletePostAttachment(input: $input) {
    contentType
    createdAt
    description
    fileUrl
    filename
    id
    title
    updatedAt
  }
}
    `;
export const FinalizePostAttachmentDocument = gql`
    mutation finalizePostAttachment($input: FinalizePostAttachmentInput!) {
  finalizePostAttachment(input: $input) {
    contentType
    createdAt
    description
    fileUrl
    filename
    id
    title
    updatedAt
  }
}
    `;
export const UpdatePostDocument = gql`
    mutation updatePost($input: UpdatePostInput!, $attachmentOrder: Order) {
  updatePost(input: $input) {
    attachments(attachmentOrder: $attachmentOrder) {
      total
    }
    author
    content
    createdAt
    id
    subject
    updatedAt
  }
}
    `;
export const UpdatePostAttachmentDocument = gql`
    mutation updatePostAttachment($input: UpdatePostAttachmentInput!) {
  updatePostAttachment(input: $input) {
    contentType
    createdAt
    description
    fileUrl
    filename
    id
    title
    updatedAt
  }
}
    `;
export const AllowedPostAttachmentMimeTypesDocument = gql`
    query allowedPostAttachmentMimeTypes {
  allowedPostAttachmentMimeTypes
}
    `;
export const PostDocument = gql`
    query post($id: String!, $attachmentOrder: Order) {
  post(id: $id) {
    attachments(attachmentOrder: $attachmentOrder) {
      data {
        contentType
        createdAt
        description
        fileUrl
        filename
        id
        title
        updatedAt
      }
      total
    }
    author
    content
    createdAt
    id
    subject
    updatedAt
  }
}
    `;
export const PostAttachmentDocument = gql`
    query postAttachment($input: ReadPostAttachmentInput!) {
  postAttachment(input: $input) {
    contentType
    createdAt
    description
    fileUrl
    filename
    id
    title
    updatedAt
  }
}
    `;
export const PostsDocument = gql`
    query posts($filterGroups: [FilterGroup!]!, $order: Order!, $pagination: Pagination!, $search: String, $attachmentOrder: Order) {
  posts(
    filterGroups: $filterGroups
    order: $order
    pagination: $pagination
    search: $search
  ) {
    data {
      attachments(attachmentOrder: $attachmentOrder) {
        data {
          contentType
          createdAt
          description
          fileUrl
          filename
          id
          title
          updatedAt
        }
        total
      }
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
    createPostAttachment(variables: CreatePostAttachmentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePostAttachmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePostAttachmentMutation>(CreatePostAttachmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPostAttachment');
    },
    deletePost(variables: DeletePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePostMutation>(DeletePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePost');
    },
    deletePostAttachment(variables: DeletePostAttachmentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePostAttachmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePostAttachmentMutation>(DeletePostAttachmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePostAttachment');
    },
    finalizePostAttachment(variables: FinalizePostAttachmentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FinalizePostAttachmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FinalizePostAttachmentMutation>(FinalizePostAttachmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'finalizePostAttachment');
    },
    updatePost(variables: UpdatePostMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePostMutation>(UpdatePostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePost');
    },
    updatePostAttachment(variables: UpdatePostAttachmentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePostAttachmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePostAttachmentMutation>(UpdatePostAttachmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePostAttachment');
    },
    allowedPostAttachmentMimeTypes(variables?: AllowedPostAttachmentMimeTypesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllowedPostAttachmentMimeTypesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllowedPostAttachmentMimeTypesQuery>(AllowedPostAttachmentMimeTypesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allowedPostAttachmentMimeTypes');
    },
    post(variables: PostQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostQuery>(PostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'post');
    },
    postAttachment(variables: PostAttachmentQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostAttachmentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostAttachmentQuery>(PostAttachmentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'postAttachment');
    },
    posts(variables: PostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostsQuery>(PostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'posts');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;