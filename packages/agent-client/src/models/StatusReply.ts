import { SourceStatus } from "./SourceStatus";

export interface StatusReply {
  status: SourceStatus;
  statusInfo: string;
}
