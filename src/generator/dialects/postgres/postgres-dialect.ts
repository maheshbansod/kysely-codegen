import type { DateParser } from "../../../introspector/dialects/postgres/date-parser.ts";
import type { NumericParser } from "../../../introspector/dialects/postgres/numeric-parser.ts";
import { PostgresIntrospectorDialect } from "../../../introspector/dialects/postgres/postgres-dialect.ts";
import type { GeneratorDialect } from "../../dialect.ts";
import { PostgresAdapter } from "./postgres-adapter.ts";

type PostgresDialectOptions = {
  dateParser?: DateParser;
  defaultSchemas?: string[];
  domains?: boolean;
  numericParser?: NumericParser;
  partitions?: boolean;
};

export class PostgresDialect extends PostgresIntrospectorDialect
  implements GeneratorDialect {
  readonly adapter: PostgresAdapter;

  constructor(options?: PostgresDialectOptions) {
    super(options);

    this.adapter = new PostgresAdapter({
      dateParser: this.options.dateParser,
      numericParser: this.options.numericParser,
    });
  }
}
