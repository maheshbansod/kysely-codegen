import { EnumCollection } from "../../enum-collection.ts";
import type { IntrospectOptions } from "../../introspector.ts";
import { Introspector } from "../../introspector.ts";
import { DatabaseMetadata } from "../../metadata/database-metadata.ts";

export class MssqlIntrospector extends Introspector<any> {
  async introspect(options: IntrospectOptions<any>) {
    const tables = await this.getTables(options);
    const enums = new EnumCollection();
    return new DatabaseMetadata({ enums, tables });
  }
}
