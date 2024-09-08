export class ErrorResponse extends Error {
  #code?: number;

  constructor(code?: number, ...errorArgs: Parameters<ErrorConstructor>) {
    super(...errorArgs);
    this.#code = code;
  }

  toString(): string {
    const code = this.#code ? `code=${this.#code}` : "";
    return `${super.toString()} ${code}`;
  }

  get code(): number | undefined {
    return this.#code;
  }
}
