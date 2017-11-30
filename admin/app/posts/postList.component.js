import React from 'react';
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
  translate as transl
} from 'admin-on-rest';
import Chip from 'material-ui/Chip';

const QuickFilter = transl(({ label, translate }) => (
  <Chip style={{ marginBottom: 8 }}>{translate(label)}</Chip>
));

const PostFilter = ({ ...props }) => (
  <Filter {...props}>
    <TextInput label='post.list.search' source='q' alwaysOn />
    <TextInput source='title' defaultValue='Qui tempore rerum et voluptates' />
    <ReferenceArrayInput source='tags' reference='tags' defaultValue={[3]}>
      <SelectArrayInput optionText='name' />
    </ReferenceArrayInput>
    <QuickFilter
      label='resources.posts.fields.commentable'
      source='commentable'
      defaultValue
    />
  </Filter>
);

const titleFieldStyle = {
  maxWidth: '20em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
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
          primaryText={record => record.title}
          secondaryText={record => `${record.views} views`}
          tertiaryText={record =>
            new Date(record.published_at).toLocaleDateString()
          }
        />
      }
      medium={
        <Datagrid>
          <TextField source='id' />
          <TextField source='title' style={titleFieldStyle} />
          <DateField source='published_at' style={{ fontStyle: 'italic' }} />
          <BooleanField
            source='commentable'
            label='resources.posts.fields.commentable_short'
          />
          <NumberField source='views' />
          <ReferenceArrayField label='Tags' reference='tags' source='tags'>
            <SingleFieldList>
              <ChipField source='name' />
            </SingleFieldList>
          </ReferenceArrayField>
          <EditButton />
          <ShowButton />
        </Datagrid>
      }
    />
  </List>
);

export default PostList;
