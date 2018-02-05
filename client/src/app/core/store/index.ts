import {
  ActionReducerMap,
  ActionReducer,
  MetaReducer,
  combineReducers
} from '@ngrx/store';

import { localStorageSync } from 'ngrx-store-localstorage';

import { DeviceEffects } from './devices/effects';


export const effects = [
  DeviceEffects
];


import * as fromDevices from './devices/reducer';

export interface RootState {
  devices: fromDevices.Store;
}

export const reducers: ActionReducerMap<RootState> = {
  devices: fromDevices.reducer
};


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['session']
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
