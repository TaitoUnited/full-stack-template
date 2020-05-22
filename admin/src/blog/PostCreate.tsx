import React from 'react';
import RichTextInput from 'ra-input-rich-text';

import {
  BooleanInput,
  Create,
  DateInput,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from 'react-admin';

const PostCreateToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton
      label="post.action.save_and_show"
      redirect="show"
      submitOnEnter
    />
    <SaveButton
      label="post.action.save_and_add"
      redirect={false}
      submitOnEnter={false}
      raised={false}
    />
  </Toolbar>
);

const PostCreate = ({ ...props }) => (
  <Create {...props}>
    <SimpleForm
      toolbar={<PostCreateToolbar />}
      validate={(values: any) => {
        const errors: any = {};
        ['subject', 'content'].forEach((field) => {
          if (!values[field]) {
            errors[field] = ['Required field'];
          }
        });

        return errors;
      }}
    >
      <TextInput source="author" />
      <TextInput source="subject" />
      <RichTextInput source="content" />
    </SimpleForm>
  </Create>
);

export default PostCreate;
