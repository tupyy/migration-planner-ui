import type { Either } from "#/common/types";

const REQUEST_TIMEOUT_SECONDS = 30 * 1000;

export function newAbortSignal(
  delay: number,
  abortMessage?: string
): AbortSignal {
  const abortController = new AbortController();
  const signal = abortController.signal;
  window.setTimeout(() => {
    abortController.abort(abortMessage);
  }, delay);
  return signal;
}

export interface Credentials {
  url: string;
  username: string;
  password: string;
  isDataSharingAllowed?: boolean;
}

export class CredentialsError extends Error {
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

interface CredentialsApi {
  putCredentials(
    credentials: Credentials
  ): Promise<Either<number, CredentialsError>>;
}

// TODO(jkilzi): Make this go away...
let statusCode: number = 204;
export const setStatusCode = (newValue: number): void => {
  statusCode = newValue;
};


class CredentialsApiImpl implements CredentialsApi {
  // TODO(jkilzi): Make this go away...
  get #plannerAgentUrl(): string {
    return `http://127.0.0.1:5173/api/credentials/${statusCode}`;
  }

  async putCredentials(
    credentials: Credentials
  ): Promise<Either<number, CredentialsError>> {
    const signal = newAbortSignal(
      REQUEST_TIMEOUT_SECONDS,
      "The server did not respond in a timely fashion."
    );
    const request = new Request(this.#plannerAgentUrl, {
      method: "PUT",
      body: JSON.stringify(credentials),
      signal,
    });

    const response = await fetch(request);
    if (response.ok) {
      return [response.status, null];
    } else {
      let message = response.statusText;
      const error = new CredentialsError(response.status, message);
      if (response.arrayBuffer.length > 0) {
        message = await response.text();
        error.message = message;
      }

      return [null, error];
    }
  }
}

export const CredentialsApiClient = new CredentialsApiImpl();
