import type { ExpressionNode } from './expression-node.ts';
import { NodeType } from './node-type.ts';

export class UnionExpressionNode {
  readonly args: ExpressionNode[];
  readonly type = NodeType.UNION_EXPRESSION;

  constructor(args: ExpressionNode[]) {
    this.args = args;
  }
}
