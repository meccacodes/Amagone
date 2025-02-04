import store from "./configureStore";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
