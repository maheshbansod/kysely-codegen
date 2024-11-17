import type { ExpressionNode } from './expression-node.ts';
import { NodeType } from './node-type.ts';
import type { TemplateNode } from './template-node.ts';

export class AliasDeclarationNode {
  readonly body: ExpressionNode | TemplateNode;
  readonly name: string;
  readonly type = NodeType.ALIAS_DECLARATION;

  constructor(name: string, body: ExpressionNode | TemplateNode) {
    this.name = name;
    this.body = body;
  }
}
