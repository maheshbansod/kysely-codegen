import micromatch from 'micromatch';
const matcher = micromatch.matcher;

export class TableMatcher {
  isMatch: (string: string) => boolean;
  isSimpleGlob: boolean;

  constructor(pattern: string) {
    this.isMatch = matcher(pattern, { nocase: true });
    this.isSimpleGlob = !pattern.includes('.');
  }

  match(schema: string | undefined, name: string) {
    const string = this.isSimpleGlob ? name : `${schema ?? '*'}.${name}`;
    return this.isMatch(string);
  }
}
