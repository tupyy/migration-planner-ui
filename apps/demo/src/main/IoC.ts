import { Container } from "inversify";
import { Configuration } from "@migration-planner-ui/api-client/runtime";
import {
  ImageApi,
  type ImageApiInterface,
  SourceApi,
  type SourceApiInterface,
} from "@migration-planner-ui/api-client/apis";
import {
  CredentialsApi,
  type CredentialsApiInterface,
} from "#/services/agent-api/apis/CredentialsApi";

const container = new Container({
  defaultScope: "Singleton",
  skipBaseClassChecks: true,
});

const serviceIdentifiers = Object.freeze({
  ImageApi: Symbol.for("ImageApi"),
  SourceApi: Symbol.for("SourceApi"),
  CredentialsApi: Symbol.for("CredentialsApi"),
});

const globalConfig = new Configuration({
  basePath: "http://127.0.0.1:5173/planner" // Proxied to "http://127.0.0.1:7443",
});
container
  .bind<SourceApiInterface>(serviceIdentifiers.SourceApi)
  .toDynamicValue((_context) => {
    const instance = new SourceApi(globalConfig);
    return instance;
  });
container
  .bind<ImageApiInterface>(serviceIdentifiers.ImageApi)
  .toDynamicValue((_context) => {
    const instance = new ImageApi(globalConfig);
    return instance;
  });
container
  .bind<CredentialsApiInterface>(serviceIdentifiers.CredentialsApi)
  .toDynamicValue((_context) => {
    const instance = new CredentialsApi(
      new Configuration({ basePath: "http://127.0.0.1:5173/agent" })
    );
    return instance;
  });

export { container, serviceIdentifiers };
