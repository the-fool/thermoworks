import { Action } from '@ngrx/store';
import { Model } from './models';

export const ActionTypes = {
  CONNECT: '[Session] Connect',
  CONNECT_SUCCESS: '[Session] Connect success',
  CONNECT_FAILURE: '[Session] Connect failure'
};

export class Connect implements Action {
  public readonly type = ActionTypes.CONNECT;
}

export class ConnectSuccess implements Action {
  constructor(public payload: Model) {}
  public readonly type = ActionTypes.CONNECT_SUCCESS;
}

export class ConnectFailure implements Action {
  public readonly type = ActionTypes.CONNECT_FAILURE;
}

export type Actions
  = Connect
  | ConnectSuccess
  | ConnectFailure;
