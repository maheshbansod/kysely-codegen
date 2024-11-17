import { ModuleReferenceNode } from "../ast/module-reference-node.ts";

export const GLOBAL_IMPORTS: {
  ColumnType: ModuleReferenceNode;
  JSONColumnType: ModuleReferenceNode;
} = {
  ColumnType: new ModuleReferenceNode("kysely"),
  JSONColumnType: new ModuleReferenceNode("kysely"),
};
