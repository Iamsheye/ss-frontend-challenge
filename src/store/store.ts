import { combineSlices, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";

const rootReducer = combineSlices({
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
