import type { ExpressionNode } from './expression-node.ts';
import { NodeType } from './node-type.ts';

export class GenericExpressionNode {
  readonly args: ExpressionNode[];
  readonly name: string;
  readonly type = NodeType.GENERIC_EXPRESSION;

  constructor(name: string, args: ExpressionNode[]) {
    this.name = name;
    this.args = args;
  }
}
