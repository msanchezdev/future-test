import {
  Type,
  type ObjectOptions,
  type StringOptions,
} from "@sinclair/typebox";
import { escapeIdent } from "surrealdb";

export const RecordId = (opts?: {
  object: ObjectOptions;
  string: StringOptions;
}) =>
  Type.Union([
    Type.Transform(
      Type.Object(
        {
          id: Type.String(),
          tb: Type.String(),
        },
        { ...opts?.object },
      ),
    )
      .Decode(({ id, tb }) => `${escapeIdent(tb)}:${escapeIdent(id)}`)
      .Encode((id) => {
        const val = id.split(":");
        return {
          tb: val[0],
          id: val[1],
        };
      }),
    Type.Transform(
      Type.String({
        ...opts?.string,
      }),
    )
      .Decode((id) => {
        const val = id.split(":");
        return {
          tb: val[0],
          id: val[1],
        };
      })
      .Encode((id) => {
        return `${escapeIdent(id.tb)}:${escapeIdent(id.id)}`;
      }),
  ]);
