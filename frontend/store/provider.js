import { createContext, useReducer, useContext } from "react";

const defaultState = {
  accountDetails: null
}

function reducer(state = defaultState, action = {}) {
  switch(action.type) {
    case "LOGIN":
      return {...state, accountDetails: action.payload}
    default: 
      return state
  }
}

const StoreContext = createContext(null);

export function StoreProvider(props)  {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)