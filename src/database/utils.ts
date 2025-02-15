/**
 * I am currently building an ORM for the SurrealDB database.
 * This implementation is just something I made for this assessment project.
 *
 * SurrealDB is an amazing project that I would encourage you to check out.
 * It is a NoSQL database that is super fast and has a lot of features.
 * I am using it for my personal projects and I think it is a great fit for
 * this project.
 */
import {
  type StaticDecode,
  type TObject,
  type TProperties,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";

export type ModelOptions<
  ModelName extends string,
  TableName extends string,
  T extends TProperties,
> = {
  name: ModelName;
  table?: TableName;
  properties: T;
};

export class Model {}

export function model<
  ModelName extends string,
  TableName extends string,
  T extends TProperties,
>(opts: ModelOptions<ModelName, TableName, T>) {
  const schema = t.Object(opts.properties);

  type InstanceFor<ModelName extends string> = StaticDecode<TObject<T>>;
  type ModelFor<
    ModelName extends string,
    TableName extends string = Lowercase<ModelName>,
  > = (new (props: StaticDecode<TObject<T>>) => InstanceFor<ModelName>) & {
    schema: typeof schema;
    name: ModelName;
    table: TableName;
  };

  const cls = class extends Model {
    static name = opts.name;
    static table = opts.table;
    static schema = schema;

    constructor(props: StaticDecode<TObject<T>>) {
      super();

      // @ts-ignore
      Object.assign(this, Value.Parse(schema, props));
    }
  } as ModelFor<ModelName, TableName>;

  Object.defineProperty(cls, "name", { value: opts.name });

  return cls;
}
