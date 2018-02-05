export interface Model {
  clientGuid: string;
  serverGuid: string;
}

export const init: Model = {
  clientGuid: '',
  serverGuid: ''
};

export const isSessionEmpty = (x: Model): boolean => !x.clientGuid || !x.serverGuid;
