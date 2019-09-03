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
  TextField,
} from 'react-admin';

import PostTitle from './PostTitle';

const PostShow = ({ ...props }) => (
  <Show title={<PostTitle />} {...props}>
    <TabbedShowLayout>
      <Tab label="post.form.summary">
        <TextField source="id" />
        <TextField source="subject" />
        <TextField source="author" />
      </Tab>
      <Tab label="post.form.body">
        <RichTextField
          source="content"
          stripTags={false}
          label=""
          addLabel={false}
        />
      </Tab>
      <Tab label="post.form.miscellaneous" />
      <Tab label="post.form.comments" />
    </TabbedShowLayout>
  </Show>
);

export default PostShow;
