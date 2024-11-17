import { deepStrictEqual } from 'node:assert';
import { describe, it } from 'vitest';
import { DateParser } from '../../introspector/dialects/postgres/date-parser.ts';
import { NumericParser } from '../../introspector/dialects/postgres/numeric-parser.ts';
import { EnumCollection } from '../../introspector/enum-collection.ts';
import { ColumnMetadata } from '../../introspector/metadata/column-metadata.ts';
import { DatabaseMetadata } from '../../introspector/metadata/database-metadata.ts';
import { TableMetadata } from '../../introspector/metadata/table-metadata.ts';
import { AliasDeclarationNode } from '../ast/alias-declaration-node.ts';
import { ArrayExpressionNode } from '../ast/array-expression-node.ts';
import { ExportStatementNode } from '../ast/export-statement-node.ts';
import { GenericExpressionNode } from '../ast/generic-expression-node.ts';
import { IdentifierNode } from '../ast/identifier-node.ts';
import { ImportClauseNode } from '../ast/import-clause-node.ts';
import { ImportStatementNode } from '../ast/import-statement-node.ts';
import { InterfaceDeclarationNode } from '../ast/interface-declaration-node.ts';
import { JsonColumnTypeNode } from '../ast/json-column-type-node.ts';
import { LiteralNode } from '../ast/literal-node.ts';
import { ObjectExpressionNode } from '../ast/object-expression-node.ts';
import { PropertyNode } from '../ast/property-node.ts';
import { RawExpressionNode } from '../ast/raw-expression-node.ts';
import { RuntimeEnumDeclarationNode } from '../ast/runtime-enum-declaration-node.ts';
import { UnionExpressionNode } from '../ast/union-expression-node.ts';
import { PostgresAdapter } from '../dialects/postgres/postgres-adapter.ts';
import { PostgresDialect } from '../dialects/postgres/postgres-dialect.ts';
import type { RuntimeEnumsStyle } from '../generator/runtime-enums-style.ts';
import { GLOBAL_DEFINITIONS } from './definitions.ts';
import { transform } from './transform.ts';

describe(transform.name, () => {
  const enums = new EnumCollection({
    'public.mood': ['happy', 'ok', 'sad'],
    'public.mood_': ['', ',', "'", "'','"],
  });

  const transformWithDefaults = ({
    camelCase,
    dateParser,
    numericParser,
    runtimeEnums,
    tables,
  }: {
    camelCase?: boolean;
    dateParser?: DateParser;
    numericParser?: NumericParser;
    runtimeEnums?: boolean;
    runtimeEnumsStyle?: RuntimeEnumsStyle;
    tables: TableMetadata[];
  }) => {
    return transform({
      camelCase,
      dialect: new PostgresDialect({ dateParser, numericParser }),
      metadata: new DatabaseMetadata({ enums, tables }),
      overrides: {
        columns: {
          'table.expression_override': new GenericExpressionNode('Generated', [
            new IdentifierNode('boolean'),
          ]),
          'table.json_override': new JsonColumnTypeNode(
            new RawExpressionNode('{ foo: "bar" }'),
          ),
          'table.raw_override': '{ test: string }',
        },
      },
      runtimeEnums,
    });
  };

  it('should transform correctly', () => {
    const nodes = transformWithDefaults({
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'boolean',
              name: 'expression_override',
            }),
            new ColumnMetadata({
              dataType: 'interval',
              hasDefaultValue: true,
              name: 'interval',
            }),
            new ColumnMetadata({
              dataType: 'interval',
              isArray: true,
              name: 'intervals',
            }),
            new ColumnMetadata({
              dataType: 'text',
              name: 'json_override',
            }),
            new ColumnMetadata({
              dataType: 'mood',
              name: 'mood',
            }),
            new ColumnMetadata({
              dataType: 'text',
              name: 'raw_override',
            }),
            new ColumnMetadata({
              dataType: 'text',
              isArray: true,
              name: 'texts',
            }),
          ],
          name: 'table',
          schema: 'public',
        }),
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'integer',
              name: 'id',
            }),
          ],
          name: 'other_table',
          schema: 'not_public',
        }),
      ],
    });

    deepStrictEqual(nodes, [
      new ImportStatementNode('kysely', [
        new ImportClauseNode('ColumnType'),
        new ImportClauseNode('JSONColumnType'),
      ]),
      new ImportStatementNode('postgres-interval', [
        new ImportClauseNode('IPostgresInterval'),
      ]),
      new ExportStatementNode(
        new AliasDeclarationNode('ArrayType', GLOBAL_DEFINITIONS.ArrayType),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode(
          'ArrayTypeImpl',
          GLOBAL_DEFINITIONS.ArrayTypeImpl,
        ),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode('Generated', GLOBAL_DEFINITIONS.Generated),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode(
          'Interval',
          new PostgresAdapter().definitions.Interval,
        ),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode(
          'Mood',
          new UnionExpressionNode([
            new LiteralNode('happy'),
            new LiteralNode('ok'),
            new LiteralNode('sad'),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'NotPublicOtherTable',
          new ObjectExpressionNode([
            new PropertyNode('id', new IdentifierNode('string')),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'Table',
          new ObjectExpressionNode([
            new PropertyNode(
              'expression_override',
              new GenericExpressionNode('Generated', [
                new IdentifierNode('boolean'),
              ]),
            ),
            new PropertyNode(
              'interval',
              new GenericExpressionNode('Generated', [
                new IdentifierNode('Interval'),
              ]),
            ),
            new PropertyNode(
              'intervals',
              new GenericExpressionNode('ArrayType', [
                new IdentifierNode('Interval'),
              ]),
            ),
            new PropertyNode(
              'json_override',
              new JsonColumnTypeNode(new RawExpressionNode('{ foo: "bar" }')),
            ),
            new PropertyNode('mood', new IdentifierNode('Mood')),
            new PropertyNode(
              'raw_override',
              new RawExpressionNode('{ test: string }'),
            ),
            new PropertyNode(
              'texts',
              new ArrayExpressionNode(new IdentifierNode('string')),
            ),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'DB',
          new ObjectExpressionNode([
            new PropertyNode(
              'not_public.other_table',
              new IdentifierNode('NotPublicOtherTable'),
            ),
            new PropertyNode('table', new IdentifierNode('Table')),
          ]),
        ),
      ),
    ]);
  });

  it('should be able to transform to camelCase', () => {
    const nodes = transformWithDefaults({
      camelCase: true,
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: '',
              hasDefaultValue: true,
              name: 'baz_qux',
            }),
          ],
          name: 'foo_bar',
          schema: 'public',
        }),
      ],
    });

    deepStrictEqual(nodes, [
      new ImportStatementNode('kysely', [new ImportClauseNode('ColumnType')]),
      new ExportStatementNode(
        new AliasDeclarationNode('Generated', GLOBAL_DEFINITIONS.Generated),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'FooBar',
          new ObjectExpressionNode([
            new PropertyNode(
              'bazQux',
              new GenericExpressionNode('Generated', [
                new IdentifierNode('string'),
              ]),
            ),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'DB',
          new ObjectExpressionNode([
            new PropertyNode('fooBar', new IdentifierNode('FooBar')),
          ]),
        ),
      ),
    ]);
  });

  it('should be able to transform using an alternative Postgres date parser', () => {
    const nodes = transformWithDefaults({
      dateParser: DateParser.STRING,
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'date',
              name: 'date',
            }),
          ],
          name: 'table',
        }),
      ],
    });

    deepStrictEqual(nodes, [
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'Table',
          new ObjectExpressionNode([
            new PropertyNode('date', new IdentifierNode('string')),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'DB',
          new ObjectExpressionNode([
            new PropertyNode('table', new IdentifierNode('Table')),
          ]),
        ),
      ),
    ]);
  });

  it('should be able to transform using an alternative Postgres numeric parser', () => {
    const nodes = transformWithDefaults({
      numericParser: NumericParser.NUMBER,
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'numeric',
              name: 'numeric',
            }),
          ],
          name: 'table',
        }),
      ],
    });

    deepStrictEqual((nodes[1] as any).argument.body.args[0].name, 'number');
  });

  it('should transform Postgres enums correctly', () => {
    const nodes = transformWithDefaults({
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'mood',
              hasDefaultValue: false,
              name: 'column1',
            }),
            new ColumnMetadata({
              dataType: 'mood_',
              hasDefaultValue: true,
              name: 'column2',
            }),
          ],
          name: 'table',
          schema: 'public',
        }),
      ],
    });

    deepStrictEqual(nodes, [
      new ImportStatementNode('kysely', [new ImportClauseNode('ColumnType')]),
      new ExportStatementNode(
        new AliasDeclarationNode('Generated', GLOBAL_DEFINITIONS.Generated),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode(
          'Mood',
          new UnionExpressionNode([
            new LiteralNode('happy'),
            new LiteralNode('ok'),
            new LiteralNode('sad'),
          ]),
        ),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode(
          'Mood2',
          new UnionExpressionNode([
            new LiteralNode(''),
            new LiteralNode(','),
            new LiteralNode("'"),
            new LiteralNode("'','"),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'Table',
          new ObjectExpressionNode([
            new PropertyNode('column1', new IdentifierNode('Mood')),
            new PropertyNode(
              'column2',
              new GenericExpressionNode('Generated', [
                new IdentifierNode('Mood2'),
              ]),
            ),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'DB',
          new ObjectExpressionNode([
            new PropertyNode('table', new IdentifierNode('Table')),
          ]),
        ),
      ),
    ]);
  });

  it('should transform Postgres runtime enums correctly', () => {
    const nodes = transformWithDefaults({
      runtimeEnums: true,
      tables: [
        new TableMetadata({
          columns: [
            new ColumnMetadata({
              dataType: 'mood',
              hasDefaultValue: false,
              name: 'column1',
            }),
            new ColumnMetadata({
              dataType: 'mood_',
              hasDefaultValue: true,
              name: 'column2',
            }),
          ],
          name: 'table',
          schema: 'public',
        }),
      ],
    });

    deepStrictEqual(nodes, [
      new ImportStatementNode('kysely', [new ImportClauseNode('ColumnType')]),
      new ExportStatementNode(
        new RuntimeEnumDeclarationNode('Mood', ['happy', 'ok', 'sad']),
      ),
      new ExportStatementNode(
        new RuntimeEnumDeclarationNode('Mood2', ['', ',', "'", "'','"]),
      ),
      new ExportStatementNode(
        new AliasDeclarationNode('Generated', GLOBAL_DEFINITIONS.Generated),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'Table',
          new ObjectExpressionNode([
            new PropertyNode('column1', new IdentifierNode('Mood')),
            new PropertyNode(
              'column2',
              new GenericExpressionNode('Generated', [
                new IdentifierNode('Mood2'),
              ]),
            ),
          ]),
        ),
      ),
      new ExportStatementNode(
        new InterfaceDeclarationNode(
          'DB',
          new ObjectExpressionNode([
            new PropertyNode('table', new IdentifierNode('Table')),
          ]),
        ),
      ),
    ]);
  });
});
