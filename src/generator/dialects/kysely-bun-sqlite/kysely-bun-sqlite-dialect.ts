import { SqliteIntrospectorDialect } from "../../../introspector/dialects/sqlite/sqlite-dialect.ts";
import type { GeneratorDialect } from "../../dialect.ts";
import { SqliteAdapter } from "../sqlite/sqlite-adapter.ts";

export class KyselyBunSqliteDialect extends SqliteIntrospectorDialect
  implements GeneratorDialect {
  readonly adapter: SqliteAdapter = new SqliteAdapter();
}
