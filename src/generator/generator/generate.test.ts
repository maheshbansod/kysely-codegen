import { strictEqual } from "node:assert";
import { readFile } from "node:fs/promises";
import { join } from "@std/path";
import { describe, test } from "vitest";
import { DateParser } from "../../introspector/dialects/postgres/date-parser.ts";
import { NumericParser } from "../../introspector/dialects/postgres/numeric-parser.ts";
import {
  addExtraColumn,
  migrate,
} from "../../introspector/introspector.fixtures.ts";
import { JsonColumnTypeNode } from "../ast/json-column-type-node.ts";
import { RawExpressionNode } from "../ast/raw-expression-node.ts";
import type { GeneratorDialect } from "../dialect.ts";
import { LibsqlDialect } from "../dialects/libsql/libsql-dialect.ts";
import { MysqlDialect } from "../dialects/mysql/mysql-dialect.ts";
import { PostgresDialect } from "../dialects/postgres/postgres-dialect.ts";
import { SqliteDialect } from "../dialects/sqlite/sqlite-dialect.ts";
import type { GenerateOptions } from "./generate.ts";
import { generate } from "./generate.ts";
import { RuntimeEnumsStyle } from "./runtime-enums-style.ts";

type Test = {
  connectionString: string;
  dialect: GeneratorDialect;
  generateOptions?: Omit<GenerateOptions, "db" | "dialect">;
  name: string;
};

const SNAPSHOTS_DIR = join(__dirname, "snapshots");

const TESTS: Test[] = [
  {
    connectionString: "libsql://localhost:8080?tls=0",
    dialect: new LibsqlDialect(),
    name: "libsql",
  },
  {
    connectionString: "mysql://user:password@localhost/database",
    dialect: new MysqlDialect(),
    name: "mysql",
  },
  {
    connectionString: "postgres://user:password@localhost:5433/database",
    dialect: new PostgresDialect(),
    name: "postgres",
  },
  {
    connectionString: "postgres://user:password@localhost:5433/database",
    dialect: new PostgresDialect({
      dateParser: DateParser.STRING,
      numericParser: NumericParser.NUMBER_OR_STRING,
    }),
    generateOptions: {
      runtimeEnums: true,
      runtimeEnumsStyle: RuntimeEnumsStyle.SCREAMING_SNAKE_CASE,
    },
    name: "postgres2",
  },
  {
    connectionString: ":memory:",
    dialect: new SqliteDialect(),
    name: "sqlite",
  },
];

describe(generate.name, () => {
  const baseGenerateOptions: Omit<GenerateOptions, "db" | "dialect"> = {
    camelCase: true,
    overrides: {
      columns: {
        "foo_bar.json_typed": new JsonColumnTypeNode(
          new RawExpressionNode('{ foo: "bar" }'),
        ),
        "foo_bar.overridden": new RawExpressionNode('"OVERRIDDEN"'),
      },
    },
  };

  describe("should generate the correct output", () => {
    for (const { connectionString, dialect, generateOptions, name } of TESTS) {
      test(`${dialect.constructor.name} (./${name}.snapshot.ts)`, async () => {
        const db = await migrate(dialect, connectionString);
        const output = await generate({
          ...baseGenerateOptions,
          ...generateOptions,
          db,
          dialect,
        });
        const expectedOutput = await readFile(
          join(SNAPSHOTS_DIR, `${name}.snapshot.ts`),
          "utf8",
        );
        strictEqual(output, expectedOutput);
        await db.destroy();
      });
    }
  });

  describe("should verify generated types", () => {
    for (const { connectionString, dialect, generateOptions, name } of TESTS) {
      test(`${dialect.constructor.name} (./${name}.snapshot.ts)`, async () => {
        const db = await migrate(dialect, connectionString);
        const outFile = join(SNAPSHOTS_DIR, `${name}.snapshot.ts`);
        await generate({
          ...baseGenerateOptions,
          ...generateOptions,
          db,
          dialect,
        });
        await addExtraColumn(db);

        try {
          await generate({
            ...baseGenerateOptions,
            ...generateOptions,
            db,
            dialect,
            outFile,
            verify: true,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            strictEqual(
              error.message,
              "Generated types are not up-to-date! Use '--log-level=error' option to view the diff.",
            );
          } else {
            throw error;
          }
        }

        await db.destroy();
      });
    }
  });
});
