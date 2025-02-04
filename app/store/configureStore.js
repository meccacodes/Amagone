import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slices/apiSlice";

const Store = configureStore({
  reducer: apiReducer,
});

export default Store;
