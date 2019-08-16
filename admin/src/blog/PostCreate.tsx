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

/* eslint-disable @typescript-eslint/camelcase */

const PostCreate = ({ ...props }) => (
  <Create {...props}>
    <SimpleForm
      toolbar={<PostCreateToolbar />}
      defaultValue={{ average_note: 0 }}
      validate={(values: any) => {
        const errors: any = {};
        ['title', 'teaser'].forEach(field => {
          if (!values[field]) {
            errors[field] = ['Required field'];
          }
        });

        if (values.average_note < 0 || values.average_note > 5) {
          errors.average_note = ['Should be between 0 and 5'];
        }

        return errors;
      }}
    >
      <TextInput source="title" />
      <TextInput source="password" type="password" />
      <TextInput source="teaser" options={{ multiLine: true }} />
      <RichTextInput source="body" />
      <DateInput source="published_at" defaultValue={() => new Date()} />
      <NumberInput source="average_note" />
      <BooleanInput source="commentable" defaultValue />
    </SimpleForm>
  </Create>
);

export default PostCreate;
