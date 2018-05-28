import React from 'react';
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
  required
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import PostTitle from './postTitle.component';

const emptyKeycode = [];

const PostEdit = ({ ...props }) => (
  <Edit title={<PostTitle />} {...props}>
    <TabbedForm defaultValue={{ average_note: 0 }}>
      <FormTab label='post.form.summary'>
        <DisabledInput source='id' />
        <TextInput source='title' validate={required()} />
        <CheckboxGroupInput
          source='notifications'
          choices={[
            { id: 12, name: 'Ray Hakt' },
            { id: 31, name: 'Ann Gullar' },
            { id: 42, name: 'Sean Phonee' }
          ]}
        />
        <LongTextInput source='teaser' validate={required()} />
        <ImageInput multiple source='pictures' accept='image/*'>
          <ImageField source='src' title='title' />
        </ImageInput>
      </FormTab>
      <FormTab label='post.form.body'>
        <RichTextInput
          source='body'
          label=''
          validate={required()}
          addLabel={false}
        />
      </FormTab>
      <FormTab label='post.form.miscellaneous'>
        <ReferenceArrayInput source='tags' reference='tags' allowEmpty>
          <SelectArrayInput
            optionText='name'
            options={{
              fullWidth: true,
              newChipKeyCodes: emptyKeycode
            }}
          />
        </ReferenceArrayInput>
        <DateInput source='published_at' options={{ locale: 'pt' }} />
        <SelectInput
          source='category'
          choices={[
            { name: 'Tech', id: 'tech' },
            { name: 'Lifestyle', id: 'lifestyle' }
          ]}
        />
        <NumberInput
          source='average_note'
          validate={[required(), number(), minValue(0)]}
        />
        <BooleanInput source='commentable' defaultValue />
        <DisabledInput source='views' />
      </FormTab>
      <FormTab label='post.form.comments'>
        <ReferenceManyField
          reference='comments'
          target='post_id'
          addLabel={false}
        >
          <Datagrid>
            <DateField source='created_at' />
            <TextField source='author.name' />
            <TextField source='body' />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default PostEdit;
