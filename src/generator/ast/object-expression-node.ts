import { NodeType } from './node-type.ts';
import type { PropertyNode } from './property-node.ts';

export class ObjectExpressionNode {
  readonly properties: PropertyNode[];
  readonly type = NodeType.OBJECT_EXPRESSION;

  constructor(properties: PropertyNode[]) {
    this.properties = properties;
  }
}
