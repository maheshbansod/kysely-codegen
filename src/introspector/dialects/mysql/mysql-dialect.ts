import { MysqlDialect as KyselyMysqlDialect } from "kysely";
import type { CreateKyselyDialectOptions } from "../../dialect.ts";
import { IntrospectorDialect } from "../../dialect.ts";
import { MysqlIntrospector } from "./mysql-introspector.ts";

export class MysqlIntrospectorDialect extends IntrospectorDialect {
  override readonly introspector: MysqlIntrospector = new MysqlIntrospector();

  async createKyselyDialect(options: CreateKyselyDialectOptions): Promise<KyselyMysqlDialect> {
    const { createPool } = await import("mysql2");

    return new KyselyMysqlDialect({
      pool: createPool({
        uri: options.connectionString,
      }),
    });
  }
}
