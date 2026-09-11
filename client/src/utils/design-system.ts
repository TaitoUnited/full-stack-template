export type DesignSystemToken<T> = T extends `$${infer U}`
  ? U
  : T extends `-$${infer S}`
    ? S
    : T;
