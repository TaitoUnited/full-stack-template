declare module 'react-admin' {
  const showNotification: (message: string, type?: string) => void;
  const withDataProvider: (component: any) => any;
  const crudCreate: (
    resource: string,
    data: any,
    basePath: string,
    redirectTo: any
  ) => any;

  const AUTH_CHECK: string;
  const AUTH_ERROR: string;
  const AUTH_LOGIN: string;
  const AUTH_LOGOUT: string;
  const AUTH_GET_PERMISSIONS: string;

  const GET_LIST: string;
  const GET_ONE: string;
  const DELETE: string;
  const UPDATE: string;
  const GET_MANY: string;
  const CREATE: string;
  const GET_MANY_REFERENCE: string;

  const Admin: any;
  const Button: any;
  const Resource: any;
  const BooleanField: any;
  const ChipField: any;
  const Datagrid: any;
  const DateField: any;
  const List: any;
  const TextField: any;
  const Create: any;
  const SimpleForm: any;
  const Edit: any;
  const DisabledInput: any;
  const BooleanInput: any;
  const DateInput: any;
  const ReferenceField: any;
  const TextInput: any;
  const Filter: any;
  const DateTimeInput: any;
  const ReferenceInput: any;
  const SelectInput: any;
  const FunctionField: any;
  const SimpleShowLayout: any;
  const Show: any;
  const ReferenceManyField: any;
  const SingleFieldList: any;
  const Pagination: any;
  const SelectField: any;
  const ArrayField: any;
  const NumberField: any;
  const NumberInput: any;
  const DeleteButton: any;
  const AutocompleteInput: any;
  const CreateButton: any;
  const SaveButton: any;
  const Toolbar: any;
  const CheckboxGroupInput: any;
  const EditButton: any;
  const FormTab: any;
  const ImageField: any;
  const ImageInput: any;
  const LongTextInput: any;
  const ReferenceArrayInput: any;
  const SelectArrayInput: any;
  const TabbedForm: any;
  const minValue: any;
  const number: any;
  const required: any;
  const ReferenceArrayField: any;
  const Responsive: any;
  const ShowButton: any;
  const SimpleList: any;
  const translate: any;
  const RichTextField: any;
  const Tab: any;
  const TabbedShowLayout: any;
  const fetchUtils: any;
  const DECLARE_RESOURCES: string;
}

declare module 'ra-language-english' {
  const en: any;
  export default en;
}

declare module 'ra-input-rich-text' {
  import React from 'react';
  export default class RichTextInput extends React.Component<any, any> {}
}
