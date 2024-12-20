import type { ExpressionNode } from "./expression-node.ts";
import { NodeType } from "./node-type.ts";

export class ExtendsClauseNode {
  readonly falseType: ExpressionNode;
  readonly trueType: ExpressionNode;
  readonly checkType: ExpressionNode;
  readonly extendsType: ExpressionNode;
  readonly type = NodeType.EXTENDS_CLAUSE;

  constructor(
    checkType: ExpressionNode,
    extendsType: ExpressionNode,
    trueType: ExpressionNode,
    falseType: ExpressionNode,
  ) {
    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }
}
