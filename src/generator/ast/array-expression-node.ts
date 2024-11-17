import type { ExpressionNode } from "./expression-node.ts";
import { NodeType } from "./node-type.ts";

export class ArrayExpressionNode {
  readonly type = NodeType.ARRAY_EXPRESSION;
  readonly values: ExpressionNode;

  constructor(values: ExpressionNode) {
    this.values = values;
  }
}
