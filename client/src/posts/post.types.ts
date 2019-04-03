export interface PostDraft {
  subject: string;
  author: string;
  content: string;
}

export interface Post extends PostDraft {
  id: string;
}
