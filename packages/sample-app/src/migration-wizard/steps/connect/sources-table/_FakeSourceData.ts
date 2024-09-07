// This type would be defined in the backend
export interface Source {
  uuid: string | number | bigint;
  name: string;
  status?: string;
  hosts?: string[]
  vms?: string[];
  networks?: string[];
  datastores?: string[]; 
}

export const fakeSources: Source[] = [
  {
    uuid: 1,
    name: "project-banco-ciudad-vcenter-1",
    status: "Waiting for credentials",
    hosts: new Array<string>(10),
    vms: new Array<string>(3000),
    networks: new Array<string>(7),
    datastores: new Array<string>(600),
  },
];
