import type { IdentifierStyle } from "../transformer/identifier-style.ts";
import type { SymbolEntry } from "../transformer/symbol-collection.ts";
import {
  SymbolCollection,
  SymbolType,
} from "../transformer/symbol-collection.ts";
import { LiteralNode } from "./literal-node.ts";
import { NodeType } from "./node-type.ts";

type RuntimeEnumMember = [key: string, value: LiteralNode<string>];

export class RuntimeEnumDeclarationNode {
  readonly members: RuntimeEnumMember[];
  name: string;
  readonly type = NodeType.RUNTIME_ENUM_DECLARATION;

  constructor(
    name: string,
    literals: string[],
    options?: { identifierStyle?: IdentifierStyle },
  ) {
    this.members = [];
    this.name = name;

    const symbolCollection = new SymbolCollection({
      entries: literals.map(
        (literal): SymbolEntry => [
          literal,
          {
            node: new LiteralNode(literal),
            type: SymbolType.RUNTIME_ENUM_MEMBER,
          },
        ],
      ),
      identifierStyle: options?.identifierStyle,
    });

    for (const { id, symbol } of symbolCollection.entries()) {
      if (symbol.type !== SymbolType.RUNTIME_ENUM_MEMBER) {
        continue;
      }

      this.members.push([id, symbol.node]);
    }
  }
}
