import React, {useReducer,createContext,} from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        const addCart = state.filter((item) => action.payload.id === item.id);
        if (addCart.length > 0) {
          return state;
        } else {
          return [...state, action.payload];
        }

      case "INCREASE":
        const increase = state.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          else{return item;}
        });
        return increase;

      case "DECREASE":
        const decrease = state.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          else{return item;}
        });
        return decrease;

      case "REMOVE":
        const remove = state.filter((item) => item.id !== action.payload.id);
        return remove;

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, []);
  const info = { state, dispatch };
  return (
    <AppContext.Provider value={info}>{props.children}</AppContext.Provider>
  );
};
