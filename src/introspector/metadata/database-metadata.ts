import { EnumCollection } from '../enum-collection.ts';
import type { TableMetadataOptions } from './table-metadata.ts';
import { TableMetadata } from './table-metadata.ts';

export class DatabaseMetadata {
  readonly enums: EnumCollection;
  readonly tables: TableMetadata[];

  constructor({
    enums,
    tables,
  }: {
    enums?: EnumCollection;
    tables: TableMetadataOptions[];
  }) {
    this.enums = enums ?? new EnumCollection();
    this.tables = tables.map((table) => new TableMetadata(table));
  }
}
