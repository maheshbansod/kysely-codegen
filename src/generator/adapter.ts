import type { DefinitionNode } from './ast/definition-node.ts';
import type { ExpressionNode } from './ast/expression-node.ts';
import { IdentifierNode } from './ast/identifier-node.ts';
import type { ModuleReferenceNode } from './ast/module-reference-node.ts';

export type Definitions = Record<string, DefinitionNode | undefined>;

export type Imports = Record<string, ModuleReferenceNode | undefined>;

export type Scalars = Record<string, ExpressionNode | undefined>;

/**
 * Specifies settings for how code should be generated for the given database library.
 */
export abstract class Adapter {
  readonly defaultScalar: ExpressionNode = new IdentifierNode('unknown');
  readonly defaultSchemas: string[] = [];
  readonly definitions: Definitions = {};
  readonly imports: Imports = {};
  readonly scalars: Scalars = {};
}
