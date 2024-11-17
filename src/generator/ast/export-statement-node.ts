import type { AliasDeclarationNode } from './alias-declaration-node.ts';
import type { InterfaceDeclarationNode } from './interface-declaration-node.ts';
import { NodeType } from './node-type.ts';
import type { RuntimeEnumDeclarationNode } from './runtime-enum-declaration-node.ts';

export class ExportStatementNode {
  readonly argument:
    | AliasDeclarationNode
    | InterfaceDeclarationNode
    | RuntimeEnumDeclarationNode;
  readonly type = NodeType.EXPORT_STATEMENT;

  constructor(
    argument:
      | AliasDeclarationNode
      | InterfaceDeclarationNode
      | RuntimeEnumDeclarationNode,
  ) {
    this.argument = argument;
  }
}
