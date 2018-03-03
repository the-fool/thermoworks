import { Action } from '@ngrx/store'
import { Model } from './models'

export const ActionTypes = {
  CONNECT: '[Session] Connect',
  CONNECT_SUCCESS: '[Session] Connect success',
  CONNECT_FAILURE: '[Session] Connect failure'
}

export interface ConnectSuccessPayload {
  clientGuid: string
  serverGuid: string
}

export class Connect implements Action {
  public readonly type = ActionTypes.CONNECT
  public readonly payload = undefined
}

export class ConnectSuccess implements Action {
  constructor(public payload: ConnectSuccessPayload) { }
  public readonly type = ActionTypes.CONNECT_SUCCESS
}

export class ConnectFailure implements Action {
  public readonly type = ActionTypes.CONNECT_FAILURE
  constructor(public payload: any) { }
}

export type Actions
  = Connect
  | ConnectSuccess
  | ConnectFailure
