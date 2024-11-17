import { NodeType } from './node-type.ts';
import type { ObjectExpressionNode } from './object-expression-node.ts';

export class InterfaceDeclarationNode {
  readonly body: ObjectExpressionNode;
  readonly name: string;
  readonly type = NodeType.INTERFACE_DECLARATION;

  constructor(name: string, body: ObjectExpressionNode) {
    this.name = name;
    this.body = body;
  }
}
