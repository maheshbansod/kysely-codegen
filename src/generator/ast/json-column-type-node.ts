import type { ExpressionNode } from './expression-node.ts';
import { GenericExpressionNode } from './generic-expression-node.ts';

export class JsonColumnTypeNode extends GenericExpressionNode {
  constructor(
    selectType: ExpressionNode,
    ...args:
      | []
      | [insertType: ExpressionNode]
      | [insertType: ExpressionNode, updateType: ExpressionNode]
  ) {
    super('JSONColumnType', [selectType, ...args]);
  }
}
