import { Action } from '@ngrx/store';
import { Device, ReadAccessCredentials } from './models';

export const ActionTypes = {
  FETCH: '[Devices] load',
  FETCH_SUCCESS: '[Devices] Fetch success',
  FETCH_FAIL: '[Devices] Fetch fail',
  ADD_READ_ACCESS: '[Devices] Add read access',

  ADD_READ_ACCESS_SUCCESS: '[Devices] Add read access success',
  ADD_READ_ACCESS_FAIL: '[Devices] Add read access fail',
};

export class Fetch implements Action {
  public readonly payload = undefined;
  public readonly type = ActionTypes.FETCH;
}

export class FetchFail implements Action {
  constructor(public payload: any) { }
  public readonly type = ActionTypes.FETCH_FAIL;
}

export class FetchSuccess implements Action {
  constructor(public payload: Device[]) { }
  public readonly type = ActionTypes.FETCH_SUCCESS;
}

export class AddReadAccess implements Action {
  constructor(public payload: ReadAccessCredentials) {}
  public readonly type = ActionTypes.ADD_READ_ACCESS;
}

export class AddReadAccessSuccess implements Action {
  public readonly payload = undefined;
  public readonly type = ActionTypes.ADD_READ_ACCESS_SUCCESS;
}
export class AddReadAccessFail implements Action {
  constructor(public payload: any) {}
  public readonly type = ActionTypes.ADD_READ_ACCESS_FAIL;
}
export type Actions
  = Fetch
  | FetchFail
  | FetchSuccess
  | AddReadAccess
  | AddReadAccessFail
  | AddReadAccessSuccess;

