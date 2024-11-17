import { NodeType } from "./node-type.ts";

export class RawExpressionNode {
  readonly expression: string;
  readonly type = NodeType.RAW_EXPRESSION;

  constructor(expression: string) {
    this.expression = expression;
  }
}
