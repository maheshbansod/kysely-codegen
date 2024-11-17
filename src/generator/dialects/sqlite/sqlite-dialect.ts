import { SqliteIntrospectorDialect } from '../../../introspector/dialects/sqlite/sqlite-dialect.ts';
import type { GeneratorDialect } from '../../dialect.ts';
import { SqliteAdapter } from './sqlite-adapter.ts';

export class SqliteDialect
  extends SqliteIntrospectorDialect
  implements GeneratorDialect
{
  readonly adapter = new SqliteAdapter();
}
