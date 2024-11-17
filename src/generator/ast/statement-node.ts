import type { ExportStatementNode } from "./export-statement-node.ts";
import type { ImportStatementNode } from "./import-statement-node.ts";

export type StatementNode = ExportStatementNode | ImportStatementNode;
