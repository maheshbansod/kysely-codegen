import type { ExpressionNode } from "./expression-node.ts";
import type { TemplateNode } from "./template-node.ts";

export type DefinitionNode = ExpressionNode | TemplateNode;
