import React from 'react';
import { translate as transl } from 'admin-on-rest';
import PostIcon from 'material-ui/svg-icons/action/book';

export { PostIcon };

export const PostTitle = transl(({ record, translate }) => (
  <span>
    {record ? translate('post.edit.title', { title: record.title }) : ''}
  </span>
));
