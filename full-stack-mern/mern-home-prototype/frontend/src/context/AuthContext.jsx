import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

// reducer function to set the user state based on the action type
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

// AuthContextProvider component to wrap the app with the context provider

export const AuthContextProvider = ({ children }) => {
  // state to hold the user object
  // dispatch function to update the user object
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  // get the user object from local storage if it exists on mount

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
