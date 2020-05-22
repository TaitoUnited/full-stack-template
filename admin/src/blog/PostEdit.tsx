import React from 'react';
import RichTextInput from 'ra-input-rich-text';

import {
  BooleanInput,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  DateInput,
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

const PostEdit = ({ ...props }) => (
  <Edit title={<PostTitle />} {...props}>
    <TabbedForm defaultValue={{ average_note: 0 }}>
      <FormTab label="post.form.summary">
        <TextInput disabled source="id" />
        <TextInput source="subject" validate={required()} />
        <TextInput disabled source="author" />
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

export default PostEdit;
