import { DateParser } from "../../../introspector/dialects/postgres/date-parser.ts";
import { NumericParser } from "../../../introspector/dialects/postgres/numeric-parser.ts";
import { Adapter } from "../../adapter.ts";
import { ColumnTypeNode } from "../../ast/column-type-node.ts";
import type { DefinitionNode } from "../../ast/definition-node.ts";
import { IdentifierNode } from "../../ast/identifier-node.ts";
import { ModuleReferenceNode } from "../../ast/module-reference-node.ts";
import { ObjectExpressionNode } from "../../ast/object-expression-node.ts";
import { PropertyNode } from "../../ast/property-node.ts";
import { UnionExpressionNode } from "../../ast/union-expression-node.ts";
import {
  JSON_ARRAY_DEFINITION,
  JSON_DEFINITION,
  JSON_OBJECT_DEFINITION,
  JSON_PRIMITIVE_DEFINITION,
  JSON_VALUE_DEFINITION,
} from "../../transformer/definitions.ts";

type PostgresAdapterOptions = {
  dateParser?: DateParser;
  numericParser?: NumericParser;
};

export class PostgresAdapter extends Adapter {
  // From https://node-postgres.com/features/types:
  // "node-postgres will convert a database type to a JavaScript string if it doesn't have a
  // registered type parser for the database type. Furthermore, you can send any type to the
  // PostgreSQL server as a string and node-postgres will pass it through without modifying it in
  // any way."
  override readonly defaultScalar: IdentifierNode = new IdentifierNode(
    "string",
  );
  override readonly defaultSchemas = ["public"];
  override readonly definitions: {
    Circle: ObjectExpressionNode,
    Int8: ColumnTypeNode,
    Interval: ColumnTypeNode,
    Json: DefinitionNode,
    JsonArray: DefinitionNode,
    JsonObject: DefinitionNode,
    JsonPrimitive: DefinitionNode,
    JsonValue: DefinitionNode,
    Numeric: ColumnTypeNode,
    Point: ObjectExpressionNode,
    Timestamp: ColumnTypeNode,
  } = {
    Circle: new ObjectExpressionNode([
      new PropertyNode("x", new IdentifierNode("number")),
      new PropertyNode("y", new IdentifierNode("number")),
      new PropertyNode("radius", new IdentifierNode("number")),
    ]),
    Int8: new ColumnTypeNode(
      new IdentifierNode("string"),
      new UnionExpressionNode([
        new IdentifierNode("string"),
        new IdentifierNode("number"),
        new IdentifierNode("bigint"),
      ]),
      new UnionExpressionNode([
        new IdentifierNode("string"),
        new IdentifierNode("number"),
        new IdentifierNode("bigint"),
      ]),
    ),
    Interval: new ColumnTypeNode(
      new IdentifierNode("IPostgresInterval"),
      new UnionExpressionNode([
        new IdentifierNode("IPostgresInterval"),
        new IdentifierNode("number"),
        new IdentifierNode("string"),
      ]),
      new UnionExpressionNode([
        new IdentifierNode("IPostgresInterval"),
        new IdentifierNode("number"),
        new IdentifierNode("string"),
      ]),
    ),
    Json: JSON_DEFINITION,
    JsonArray: JSON_ARRAY_DEFINITION,
    JsonObject: JSON_OBJECT_DEFINITION,
    JsonPrimitive: JSON_PRIMITIVE_DEFINITION,
    JsonValue: JSON_VALUE_DEFINITION,
    Numeric: new ColumnTypeNode(
      new IdentifierNode("string"),
      new UnionExpressionNode([
        new IdentifierNode("number"),
        new IdentifierNode("string"),
      ]),
      new UnionExpressionNode([
        new IdentifierNode("number"),
        new IdentifierNode("string"),
      ]),
    ),
    Point: new ObjectExpressionNode([
      new PropertyNode("x", new IdentifierNode("number")),
      new PropertyNode("y", new IdentifierNode("number")),
    ]),
    Timestamp: new ColumnTypeNode(
      new IdentifierNode("Date"),
      new UnionExpressionNode([
        new IdentifierNode("Date"),
        new IdentifierNode("string"),
      ]),
      new UnionExpressionNode([
        new IdentifierNode("Date"),
        new IdentifierNode("string"),
      ]),
    ),
  };
  override readonly imports: {
    IPostgresInterval: ModuleReferenceNode;
}
 = {
    IPostgresInterval: new ModuleReferenceNode("postgres-interval"),
  };
  // These types have been found through experimentation in Adminer and in the 'pg' source code.
  override readonly scalars: {
    bit: IdentifierNode;
    bool: IdentifierNode;
    box: IdentifierNode;
    bpchar: IdentifierNode;
    bytea: IdentifierNode;
    cidr: IdentifierNode;
    circle: IdentifierNode;
    date: IdentifierNode;
    float4: IdentifierNode;
    float8: IdentifierNode;
    inet: IdentifierNode;
    int2: IdentifierNode;
    int4: IdentifierNode;
    int8: IdentifierNode;
    interval: IdentifierNode;
    json: IdentifierNode;
    jsonb: IdentifierNode;
    line: IdentifierNode;
    lseg: IdentifierNode;
    macaddr: IdentifierNode;
    money: IdentifierNode;
    numeric: IdentifierNode;
    oid: IdentifierNode;
    path: IdentifierNode;
    point: IdentifierNode;
    polygon: IdentifierNode;
    text: IdentifierNode;
    time: IdentifierNode;
    timestamp: IdentifierNode;
    timestamptz: IdentifierNode;
    tsquery: IdentifierNode;
    tsvector: IdentifierNode;
    txid_snapshot: IdentifierNode;
    uuid: IdentifierNode;
    varbit: IdentifierNode;
    varchar: IdentifierNode;
    xml: IdentifierNode;
  } = {
    bit: new IdentifierNode("string"),
    bool: new IdentifierNode("boolean"), // Specified as "boolean" in Adminer.
    box: new IdentifierNode("string"),
    bpchar: new IdentifierNode("string"), // Specified as "character" in Adminer.
    bytea: new IdentifierNode("Buffer"),
    cidr: new IdentifierNode("string"),
    circle: new IdentifierNode("Circle"),
    date: new IdentifierNode("Timestamp"),
    float4: new IdentifierNode("number"), // Specified as "real" in Adminer.
    float8: new IdentifierNode("number"), // Specified as "double precision" in Adminer.
    inet: new IdentifierNode("string"),
    int2: new IdentifierNode("number"), // Specified in 'pg' source code.
    int4: new IdentifierNode("number"), // Specified in 'pg' source code.
    int8: new IdentifierNode("Int8"), // Specified as "bigint" in Adminer.
    interval: new IdentifierNode("Interval"),
    json: new IdentifierNode("Json"),
    jsonb: new IdentifierNode("Json"),
    line: new IdentifierNode("string"),
    lseg: new IdentifierNode("string"),
    macaddr: new IdentifierNode("string"),
    money: new IdentifierNode("string"),
    numeric: new IdentifierNode("Numeric"),
    oid: new IdentifierNode("number"), // Specified in 'pg' source code.
    path: new IdentifierNode("string"),
    point: new IdentifierNode("Point"),
    polygon: new IdentifierNode("string"),
    text: new IdentifierNode("string"),
    time: new IdentifierNode("string"),
    timestamp: new IdentifierNode("Timestamp"),
    timestamptz: new IdentifierNode("Timestamp"),
    tsquery: new IdentifierNode("string"),
    tsvector: new IdentifierNode("string"),
    txid_snapshot: new IdentifierNode("string"),
    uuid: new IdentifierNode("string"),
    varbit: new IdentifierNode("string"), // Specified as "bit varying" in Adminer.
    varchar: new IdentifierNode("string"), // Specified as "character varying" in Adminer.
    xml: new IdentifierNode("string"),
  };

  constructor(options?: PostgresAdapterOptions) {
    super();

    if (options?.dateParser === DateParser.STRING) {
      this.scalars.date = new IdentifierNode("string");
    } else {
      this.scalars.date = new IdentifierNode("Timestamp");
    }

    if (options?.numericParser === NumericParser.NUMBER) {
      this.definitions.Numeric = new ColumnTypeNode(
        new IdentifierNode("number"),
        new UnionExpressionNode([
          new IdentifierNode("number"),
          new IdentifierNode("string"),
        ]),
        new UnionExpressionNode([
          new IdentifierNode("number"),
          new IdentifierNode("string"),
        ]),
      );
    } else if (options?.numericParser === NumericParser.NUMBER_OR_STRING) {
      this.definitions.Numeric = new ColumnTypeNode(
        new UnionExpressionNode([
          new IdentifierNode("number"),
          new IdentifierNode("string"),
        ]),
      );
    }
  }
}
