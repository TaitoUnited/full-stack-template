export type StyledSystemToken<T> = T extends `$${infer U}` ? U : T;
