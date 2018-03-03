import { ActionTypes, Actions } from './actions'
import { Model, init } from './models'

export type Store = Model

export function reducer(state = init, act: Actions): Store {
  switch (act.type) {
    case ActionTypes.CONNECT:
      return { ...state, loading: true }
    case ActionTypes.CONNECT_FAILURE:
      return { ...state, loading: false }
    case ActionTypes.CONNECT_SUCCESS:
      return { ...act.payload, loading: false }
    default:
      return state
  }
}
