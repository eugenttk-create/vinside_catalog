import { configureStore } from "@reduxjs/toolkit";
import catalogsReducer from "./catalogs/catalogsSlice";
import modelsReducer from "./models/modelsSlice";
import parametersReducer from "./parameters/parametersSlice";

const store = configureStore({
  reducer: {
    catalogs: catalogsReducer,
    models: modelsReducer,
    parameters: parametersReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
