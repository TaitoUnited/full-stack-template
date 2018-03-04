import React from 'react';
import { translate as transl } from 'admin-on-rest';

const PostTitle = transl(({ record, translate }) => (
  <span>
    {record ? translate('post.edit.title', { title: record.title }) : ''}
  </span>
));

export default PostTitle;
