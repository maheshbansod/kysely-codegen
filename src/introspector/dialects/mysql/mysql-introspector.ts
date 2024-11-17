import type { Kysely, TableMetadata as KyselyTableMetadata } from "kysely";
import { EnumCollection } from "../../enum-collection.ts";
import type { IntrospectOptions } from "../../introspector.ts";
import { Introspector } from "../../introspector.ts";
import { DatabaseMetadata } from "../../metadata/database-metadata.ts";
import type { MysqlDB } from "./mysql-db.ts";
import { MysqlParser } from "./mysql-parser.ts";

const ENUM_REGEXP = /^enum\(.*\)$/;

export class MysqlIntrospector extends Introspector<MysqlDB> {
  #createDatabaseMetadata({
    enums,
    tables: rawTables,
  }: {
    enums: EnumCollection;
    tables: KyselyTableMetadata[];
  }) {
    const tables = rawTables.map((table) => ({
      ...table,
      columns: table.columns.map((column) => ({
        ...column,
        enumValues: column.dataType === "enum"
          ? enums.get(`${table.schema ?? ""}.${table.name}.${column.name}`)
          : null,
      })),
    }));
    return new DatabaseMetadata({ tables });
  }

  async #introspectEnums(db: Kysely<MysqlDB>) {
    const enums = new EnumCollection();

    const rows = await db
      .withoutPlugins()
      .selectFrom("information_schema.COLUMNS")
      .select(["COLUMN_NAME", "COLUMN_TYPE", "TABLE_NAME", "TABLE_SCHEMA"])
      .execute();

    for (const row of rows) {
      if (ENUM_REGEXP.test(row.COLUMN_TYPE)) {
        const key = `${row.TABLE_SCHEMA}.${row.TABLE_NAME}.${row.COLUMN_NAME}`;
        const parser = new MysqlParser(row.COLUMN_TYPE);
        const values = parser.parseEnum();
        enums.set(key, values);
      }
    }

    return enums;
  }

  async introspect(options: IntrospectOptions<MysqlDB>) {
    const tables = await this.getTables(options);
    const enums = await this.#introspectEnums(options.db);
    return this.#createDatabaseMetadata({ enums, tables });
  }
}
