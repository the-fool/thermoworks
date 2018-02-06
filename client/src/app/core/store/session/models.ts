export interface Model {
  loading: boolean;
  clientGuid: string;
  serverGuid: string;
}

export const init: Model = {
  loading: false,
  clientGuid: '',
  serverGuid: ''
};

export const isSessionEmpty = (x: Model): boolean => !x.clientGuid || !x.serverGuid;
