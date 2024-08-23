import SchemaBuilder from '@pothos/core';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

import { DrizzleDb } from '~/db';

type Root<T> = {
  Context: T;
};

export type Context = {
  db: DrizzleDb;
};

export const builder = new SchemaBuilder<Root<Context>>({
  plugins: [SimpleObjectsPlugin],
});

export type SchemaBuilder = typeof builder;
