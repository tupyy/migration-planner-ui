import type { StatusCode, Either } from "#/common/types";
import { ErrorResponse } from "./ErrorResponse";
import type { Credentials } from "#/clients/planner-agent/models/Credentials";
import { Time } from "#/common/time";
import { newAbortSignal } from "./AbortSignal";

const plannerApiUrl = "http://127.0.0.1:5173/api/credentials/";
const REQUEST_TIMEOUT_SECONDS = 30 * Time.Second;

interface PlannerAgentApi {
  putCredentials(
    credentials: Credentials,
    mockedResponseStatusCode?: StatusCode // TODO(jkilzi): Make it got away...
  ): Promise<Either<number, ErrorResponse>>;
}

class PlannerAgentApiClientImpl implements PlannerAgentApi {
  async putCredentials(
    credentials: Credentials,
    mockedResponseStatusCode?: StatusCode
  ): Promise<Either<number, ErrorResponse>> {
    const signal = newAbortSignal(
      REQUEST_TIMEOUT_SECONDS,
      "The server did not respond in a timely fashion."
    );
    const request = new Request(plannerApiUrl + mockedResponseStatusCode, {
      method: "PUT",
      body: JSON.stringify(credentials),
      signal,
    });

    const response = await fetch(request);
    if (response.ok) {
      return [response.status, null];
    } else {
      let message = response.statusText;
      const error = new ErrorResponse(response.status, message);
      if (response.arrayBuffer.length > 0) {
        message = await response.text();
        error.message = message;
      }

      return [null, error];
    }
  }
}

export const PlannerAgentApiClient = new PlannerAgentApiClientImpl();
