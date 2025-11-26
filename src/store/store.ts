import { configureStore } from "@reduxjs/toolkit";
import catalogsReducer from "./catalogs/catalogsSlice";
import modelsReducer from "./models/modelsSlice";
import parametersReducer from "./parameters/parametersSlice";
import groupsReducer from "./groups/groupsSlice";
import partsReducer from "./parts/partsSlice";

const store = configureStore({
  reducer: {
    catalogs: catalogsReducer,
    models: modelsReducer,
    parameters: parametersReducer,
    groups: groupsReducer,
    parts: partsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
