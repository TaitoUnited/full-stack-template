import React from 'react';
import RichTextInput from 'ra-input-rich-text';

import {
  BooleanInput,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  Edit,
  EditButton,
  FormTab,
  ImageField,
  ImageInput,
  LongTextInput,
  NumberInput,
  ReferenceManyField,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  TabbedForm,
  TextField,
  TextInput,
  minValue,
  number,
  required,
} from 'react-admin';

import PostTitle from './PostTitle';

/* eslint-disable @typescript-eslint/camelcase */

const PostEdit = ({ ...props }) => (
  <Edit title={<PostTitle />} {...props}>
    <TabbedForm defaultValue={{ average_note: 0 }}>
      <FormTab label="post.form.summary">
        <DisabledInput source="id" />
        <TextInput source="subject" validate={required()} />
        <DisabledInput source="author" />
      </FormTab>
      <FormTab label="post.form.body">
        <RichTextInput
          source="subject"
          label=""
          validate={required()}
          addLabel={false}
        />
      </FormTab>
    </TabbedForm>
  </Edit>
);

/* eslint-enable @typescript-eslint/camelcase */

export default PostEdit;
