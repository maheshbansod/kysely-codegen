import type { ArrayExpressionNode } from './array-expression-node.ts';
import type { ExtendsClauseNode } from './extends-clause-node.ts';
import type { GenericExpressionNode } from './generic-expression-node.ts';
import type { IdentifierNode } from './identifier-node.ts';
import type { InferClauseNode } from './infer-clause-node.ts';
import type { LiteralNode } from './literal-node.ts';
import type { MappedTypeNode } from './mapped-type-node.ts';
import type { ObjectExpressionNode } from './object-expression-node.ts';
import type { RawExpressionNode } from './raw-expression-node.ts';
import type { UnionExpressionNode } from './union-expression-node.ts';

export type ExpressionNode =
  | ArrayExpressionNode
  | ExtendsClauseNode
  | GenericExpressionNode
  | IdentifierNode
  | InferClauseNode
  | LiteralNode
  | MappedTypeNode
  | ObjectExpressionNode
  | RawExpressionNode
  | UnionExpressionNode;
