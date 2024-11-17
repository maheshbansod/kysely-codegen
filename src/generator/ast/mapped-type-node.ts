import type { ExpressionNode } from './expression-node.ts';
import { NodeType } from './node-type.ts';

export class MappedTypeNode {
  readonly type = NodeType.MAPPED_TYPE;
  readonly value: ExpressionNode;

  constructor(value: ExpressionNode) {
    this.value = value;
  }
}
