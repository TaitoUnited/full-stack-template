import React from 'react';
import Chip from '@material-ui/core/Chip';

import {
  BooleanField,
  ChipField,
  Datagrid,
  DateField,
  EditButton,
  Filter,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceArrayInput,
  Responsive,
  SelectArrayInput,
  ShowButton,
  SimpleList,
  SingleFieldList,
  TextField,
  TextInput,
  translate as transl,
} from 'react-admin';

const QuickFilter = transl(
  ({
    label,
    translate,
  }: {
    label: string;
    translate: (s: string) => string;
  }) => <Chip style={{ marginBottom: 8 }} label={translate(label)} />
);

const PostFilter = ({ ...props }) => (
  <Filter {...props}>
    <TextInput label="post.list.search" source="q" alwaysOn />
    <TextInput source="title" defaultValue="Qui tempore rerum et voluptates" />
    <ReferenceArrayInput source="tags" reference="tags" defaultValue={[3]}>
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
    <QuickFilter
      label="resources.posts.fields.commentable"
      source="commentable"
      defaultValue
    />
  </Filter>
);

const titleFieldStyle = {
  maxWidth: '20em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const PostList = ({ ...props }) => (
  <List
    {...props}
    filters={<PostFilter />}
    sort={{ field: 'published_at', order: 'DESC' }}
  >
    <Responsive
      small={
        <SimpleList
          primaryText={(record: any) => record.subject}
          secondaryText={(record: any) => record.author}
          tertiaryText={(record: any) =>
            new Date(record.createdAt).toLocaleDateString()
          }
        />
      }
      medium={
        <Datagrid>
          <TextField source="id" />
          <TextField source="author" />
          <TextField source="subject" style={titleFieldStyle} />
          <DateField source="createdAt" style={{ fontStyle: 'italic' }} />
          <EditButton />
          <ShowButton />
        </Datagrid>
      }
    />
  </List>
);

export default PostList;
