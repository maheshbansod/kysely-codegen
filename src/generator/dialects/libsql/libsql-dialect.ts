import { LibsqlIntrospectorDialect } from '../../../introspector/dialects/libsql/libsql-dialect.ts';
import type { GeneratorDialect } from '../../dialect.ts';
import { LibsqlAdapter } from './libsql-adapter.ts';

export class LibsqlDialect
  extends LibsqlIntrospectorDialect
  implements GeneratorDialect
{
  readonly adapter = new LibsqlAdapter();
}
