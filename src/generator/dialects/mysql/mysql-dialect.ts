import { MysqlIntrospectorDialect } from "../../../introspector/dialects/mysql/mysql-dialect.ts";
import type { GeneratorDialect } from "../../dialect.ts";
import { MysqlAdapter } from "./mysql-adapter.ts";

export class MysqlDialect extends MysqlIntrospectorDialect
  implements GeneratorDialect {
  readonly adapter = new MysqlAdapter();
}
