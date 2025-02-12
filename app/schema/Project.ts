export class Project {
  readonly id: string;
  constructor(
    readonly code: string,
    readonly subCode: string,
    readonly description: string,
    readonly requiresClient: boolean = false,
    readonly color: string
  ) {
    this.id = makeFullCode(code, subCode);
  }

  get fullCode() {
    return makeFullCode(this.code, this.subCode);
  }
}

export function makeFullCode(code: string, subCode?: string) {
  return subCode ? `${code}:${subCode}` : code;
}
