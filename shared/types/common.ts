export interface DbItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  username: String;
  firstName: String;
  lastName: String;
  email?: String;
  language?: String;
}
