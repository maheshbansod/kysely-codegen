import type { DateParser } from '../introspector/dialects/postgres/date-parser.ts';
import type { NumericParser } from '../introspector/dialects/postgres/numeric-parser.ts';
import type { GeneratorDialect } from './dialect.ts';
import { KyselyBunSqliteDialect } from './dialects/kysely-bun-sqlite/kysely-bun-sqlite-dialect.ts';
import { LibsqlDialect } from './dialects/libsql/libsql-dialect.ts';
import { MssqlDialect } from './dialects/mssql/mssql-dialect.ts';
import { MysqlDialect } from './dialects/mysql/mysql-dialect.ts';
import { PostgresDialect } from './dialects/postgres/postgres-dialect.ts';
import { SqliteDialect } from './dialects/sqlite/sqlite-dialect.ts';
import { WorkerBunSqliteDialect } from './dialects/worker-bun-sqlite/worker-bun-sqlite-dialect.ts';

export type DialectName =
  | 'bun-sqlite'
  | 'kysely-bun-sqlite'
  | 'libsql'
  | 'mssql'
  | 'mysql'
  | 'postgres'
  | 'sqlite'
  | 'worker-bun-sqlite';

type DialectManagerOptions = {
  dateParser?: DateParser;
  domains?: boolean;
  numericParser?: NumericParser;
  partitions?: boolean;
};

/**
 * Returns a dialect instance for a pre-defined dialect name.
 */
export class DialectManager {
  readonly #options: DialectManagerOptions;

  constructor(options: DialectManagerOptions) {
    this.#options = options;
  }

  getDialect(name: DialectName): GeneratorDialect {
    switch (name) {
      case 'kysely-bun-sqlite':
        return new KyselyBunSqliteDialect();
      case 'libsql':
        return new LibsqlDialect();
      case 'mssql':
        return new MssqlDialect();
      case 'mysql':
        return new MysqlDialect();
      case 'postgres':
        return new PostgresDialect(this.#options);
      case 'bun-sqlite': // Legacy.
      case 'worker-bun-sqlite':
        return new WorkerBunSqliteDialect();
      default:
        return new SqliteDialect();
    }
  }
}
