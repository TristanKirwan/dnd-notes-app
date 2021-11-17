import { createContext, useReducer, useContext, useEffect } from "react";
import getAccessToken from "../utils/getAccessToken";
import jwt from 'jsonwebtoken'


const defaultState = {
  accountDetails: null
}

function reducer(state = defaultState, action = {}) {
  switch(action.type) {
    case "LOGIN":
      return {...state, accountDetails: action.payload}
    case "LOGOUT": 
      return {...state, accountDetails: null}
    default: 
      return state
  }
}

const StoreContext = createContext(null);

export function StoreProvider(props)  {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    const accessToken = getAccessToken();
    if(accessToken) {
      const decoded = jwt.decode(accessToken);
      const accountDetails = {username: decoded.username}
      dispatch({type: 'LOGIN', payload: accountDetails})
    }
  }, [])

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)