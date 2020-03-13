export type Primitive = null | boolean | number | string;

export type Json =
  | Primitive
  | Json[]
  | { [prop: string]: Json };

export type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : JsonCompatible<T[P]>;
};