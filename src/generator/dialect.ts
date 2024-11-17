import { IntrospectorDialect } from "../introspector/dialect.ts";
import type { Adapter } from "./adapter.ts";

/**
 * A Dialect is the glue between the codegen and the specified database.
 */
export abstract class GeneratorDialect extends IntrospectorDialect {
  abstract readonly adapter: Adapter;
}
