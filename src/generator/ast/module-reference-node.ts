import { NodeType } from './node-type.ts';

export class ModuleReferenceNode {
  readonly name: string;
  readonly type = NodeType.MODULE_REFERENCE;

  constructor(name: string) {
    this.name = name;
  }
}
