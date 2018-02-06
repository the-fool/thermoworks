import {
  ActionReducerMap,
  ActionReducer,
  MetaReducer,
  combineReducers
} from '@ngrx/store';

import { localStorageSync } from 'ngrx-store-localstorage';

import { DeviceEffects } from './devices/effects';
import { SessionEffects } from './session/effects';

import * as fromDevices from './devices/reducer';
import * as fromSession from './session/reducer';

export const effects = [
  DeviceEffects,
  SessionEffects
];

export interface RootState {
  session: fromSession.Store;
  devices: fromDevices.Store;
}

export const reducers: ActionReducerMap<RootState> = {
  devices: fromDevices.reducer,
  session: fromSession.reducer,
};


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['session'],
    rehydrate: true,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
