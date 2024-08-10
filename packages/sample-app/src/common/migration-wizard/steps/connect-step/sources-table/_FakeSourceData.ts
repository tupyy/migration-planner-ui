// This type would be defined in the backend
export interface Source {
  uuid: string | number | bigint;
  name: string;
  status?: string;
  vmUrl?: string;
}

// In real usage, this data would come from some external source like an API via props.
export const fakeSources: Source[] = [
  {
    uuid: 1,
    name: "project-banco-ciudad-vcenter-1",
    status: "Waiting for credentials",
    vmUrl: "https://104.121.23.193:443",
  },
];
