import { SqliteDialect as KyselySqliteDialect } from "kysely";
import type { CreateKyselyDialectOptions } from "../../dialect.ts";
import { IntrospectorDialect } from "../../dialect.ts";
import { SqliteIntrospector } from "./sqlite-introspector.ts";

export class SqliteIntrospectorDialect extends IntrospectorDialect {
  override readonly introspector: SqliteIntrospector = new SqliteIntrospector();

  async createKyselyDialect(options: CreateKyselyDialectOptions) {
    const { default: Database } = await import("better-sqlite3");

    return new KyselySqliteDialect({
      database: new Database(options.connectionString),
    });
  }
}
