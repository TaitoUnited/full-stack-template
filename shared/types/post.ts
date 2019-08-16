import { DbItem } from './common';

export interface PostBasics {
  subject: string;
  author: string;
  content: string;
}

export interface Post extends PostBasics, DbItem {
}
