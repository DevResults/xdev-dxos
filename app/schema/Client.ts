export class Client {
  readonly id: string;
  constructor(readonly code: string) {
    this.id = code;
  }
}
