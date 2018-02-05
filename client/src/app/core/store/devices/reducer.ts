import { ActionTypes, Actions } from './actions';
import { Store, initStore } from './models';
export type Store = Store;

export function reducer(state = initStore, act: Actions): Store {
  switch (act.type) {
    case (ActionTypes.FETCH): {
      return { ...state, loading: true };
    }
    case (ActionTypes.FETCH_FAIL): {
      return { ...state, loading: false };
    }
    case (ActionTypes.FETCH_SUCCESS): {
      return { ...state, loading: false, devices: act.payload };
    }
    default:
      return state;
  }
}
