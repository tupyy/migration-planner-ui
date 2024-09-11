import type { Either } from "#/common/Types";
import { Credentials } from "#/services/agent-api/models/Credentials";
import { CredentialsError } from "#/services/agent-api/models/CredentialsError";

interface Configuration {
  basePath: string;
}

export interface CredentialsApiInterface {
  putCredentials(
    credentials: Credentials,
    options?: RequestInit & { pathParams?: string[] }
  ): Promise<Either<number, CredentialsError>>;
}

export class CredentialsApi implements CredentialsApiInterface {
  private readonly configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  async putCredentials(
    credentials: Credentials,
    options?: RequestInit & { pathParams?: string[] }
  ): Promise<Either<number, CredentialsError>> {
    const request = new Request(
      this.configuration.basePath +
        "/api/credentials" +
        (options?.pathParams ?? ["/"]).join("/"),
      {
        method: "PUT",
        body: JSON.stringify(credentials),
        ...(options?.signal && { signal: options.signal }),
      }
    );

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
