import type { ExpressionNode } from "./expression-node.ts";
import { NodeType } from "./node-type.ts";

export class TemplateNode {
  readonly expression: ExpressionNode;
  readonly params: string[];
  readonly type = NodeType.TEMPLATE;

  constructor(params: string[], expression: ExpressionNode) {
    this.params = params;
    this.expression = expression;
  }
}
