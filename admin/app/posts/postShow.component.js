import React from 'react';
import {
  BooleanField,
  ChipField,
  Datagrid,
  DateField,
  EditButton,
  NumberField,
  ReferenceArrayField,
  ReferenceManyField,
  RichTextField,
  SelectField,
  Show,
  SingleFieldList,
  Tab,
  TabbedShowLayout,
  TextField
} from 'admin-on-rest';

import PostTitle from './postTitle.component';

const PostShow = ({ ...props }) => (
  <Show title={<PostTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label='post.form.summary'>
        <TextField source='id' />
        <TextField source='title' />
        <TextField source='teaser' />
      </Tab>
      <Tab label='post.form.body'>
        <RichTextField
          source='body'
          stripTags={false}
          label=''
          addLabel={false}
        />
      </Tab>
      <Tab label='post.form.miscellaneous'>
        <ReferenceArrayField reference='tags' source='tags'>
          <SingleFieldList>
            <ChipField source='name' />
          </SingleFieldList>
        </ReferenceArrayField>
        <DateField source='published_at' />
        <SelectField
          source='category'
          choices={[
            { name: 'Tech', id: 'tech' },
            { name: 'Lifestyle', id: 'lifestyle' }
          ]}
        />
        <NumberField source='average_note' />
        <BooleanField source='commentable' />
        <TextField source='views' />
      </Tab>
      <Tab label='post.form.comments'>
        <ReferenceManyField
          label='resources.posts.fields.comments'
          reference='comments'
          target='post_id'
          sort={{ field: 'created_at', order: 'DESC' }}
        >
          <Datagrid selectable={false}>
            <DateField source='created_at' />
            <TextField source='author.name' />
            <TextField source='body' />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default PostShow;
