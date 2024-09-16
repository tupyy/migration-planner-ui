import { Either } from "#/common/Types";
import { Symbols } from "#/main/Symbols";
import type { SourceApiInterface } from "@migration-planner-ui/api-client/apis";
import { Source } from "@migration-planner-ui/api-client/models";
import { inject, injectable } from "inversify";
import { action, observable } from "mobx";

export interface DiscoverySourcesStoreInterface {
  sources: Source[];

  loadingSources: boolean;
  addingSource: boolean;
  deletingSource: boolean;

  listSources: () => Promise<Either<Source[], Error>>;
  deleteSource: (id: string) => Promise<Either<void, Error>>;
  addSource: () => Promise<Either<Blob, Error>>;
}

export
@injectable()
@observable
class DiscoverySourcesStore implements DiscoverySourcesStoreInterface {
  readonly #sourceApi: SourceApiInterface;
  readonly #sources: Array<Source>;

  #loadingSources: boolean = false;
  #deletingSource: boolean = false;
  #addingSource: boolean = false;

  constructor(@inject(Symbols.SourceApi) sourceApi: SourceApiInterface) {
    this.#sourceApi = sourceApi;
    this.#sources = [];
  }

  get sources(): Source[] {
    return this.#sources;
  }

  get loadingSources(): boolean {
    return this.#loadingSources;
  }

  set loadingSources(newValue: boolean) {
    this.#loadingSources = newValue;
  }

  get addingSource(): boolean {
    return this.#addingSource;
  }

  set addingSource(newValue: boolean) {
    this.#loadingSources = newValue;
  }

  get deletingSource(): boolean {
    return this.#deletingSource;
  }

  set deletingSource(newValue: boolean) {
    this.#loadingSources = newValue;
  }

  @action
  async listSources(): Promise<Either<Source[], Error>> {
    try {
      this.loadingSources = true;
      const sources = await this.#sourceApi.listSources();
      action(() => {
        this.#sources.push(...sources);
      });
      return [this.sources, null];
    } catch (error) {
      this.loadingSources = false;
      return [null, error as Error];
    }
  }

  @action
  async deleteSource(id: string): Promise<Either<undefined, Error>> {
    try {
      this.deletingSource = true;
      await this.#sourceApi.deleteSource({ id });
      action(() => {
        const sourceAtIndex = this.#sources.findIndex((src) => src.id === id);
        this.#sources.splice(sourceAtIndex, 1);
      });
      return [undefined, null];
    } catch (error) {
      this.deletingSource = false;
      return [null, error as Error];
    }
  }

  @action
  async addSource(): Promise<Either<Blob, Error>> {
    try {
      this.addingSource = true;
      const source = await this.#sourceApi.createSource({
        sourceCreate: {
          name: "lon-vcenter-prod-1",
        },
      });
      const blob = await this.#sourceApi.getSourceImage({ id: source.id });
      return [blob, null];
    } catch (error) {
      this.addingSource = false;
      return [null, error as Error];
    }
  }
}
