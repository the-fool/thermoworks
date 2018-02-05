export interface Device {
  name: string;
  serial: string;
  readAccess: boolean;
  writeAccess: boolean;
}

export interface Store {
  devices: Device[];
  loading: boolean;
}

export interface ReadAccessCredentials {
  serial: string;
  readKey: string;
}

export const initStore: Store = {
  devices: [],
  loading: false
};
