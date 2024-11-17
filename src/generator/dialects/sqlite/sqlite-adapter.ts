import { Adapter } from "../../adapter.ts";
import { IdentifierNode } from "../../ast/identifier-node.ts";

export class SqliteAdapter extends Adapter {
  override readonly defaultScalar: IdentifierNode = new IdentifierNode(
    "string",
  );
  override readonly scalars: {
    any: IdentifierNode;
    blob: IdentifierNode;
    boolean: IdentifierNode;
    integer: IdentifierNode;
    numeric: IdentifierNode;
    real: IdentifierNode;
    text: IdentifierNode;
  } = {
    any: new IdentifierNode("unknown"),
    blob: new IdentifierNode("Buffer"),
    boolean: new IdentifierNode("number"),
    integer: new IdentifierNode("number"),
    numeric: new IdentifierNode("number"),
    real: new IdentifierNode("number"),
    text: new IdentifierNode("string"),
  };
}
