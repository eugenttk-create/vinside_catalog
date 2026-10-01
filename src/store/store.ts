import { configureStore, combineReducers } from "@reduxjs/toolkit";
import catalogsReducer from "./catalogs/catalogsSlice";
import modelsReducer from "./models/modelsSlice";
import parametersReducer from "./parameters/parametersSlice";
import groupsReducer from "./groups/groupsSlice";
import partsReducer from "./parts/partsSlice";
import OEReducer from "./OE/OESlice";
import analogsReducer from "./analogs/analogsSlice";
import breadcrumbsReducer from "./breadcrumbs/breadcrumbsSlice";
import languageReducer from "./language/languageSlice";
import notificationsReducer from "./notifications/notificationsSlice";
import themeReducer from "./theme/themeSlice";
import { errorMiddleware } from "./middleware/errorMiddleware";

const appReducer = combineReducers({
  catalogs: catalogsReducer,
  models: modelsReducer,
  parameters: parametersReducer,
  groups: groupsReducer,
  parts: partsReducer,
  OE: OEReducer,
  analogs: analogsReducer,
  breadcrumbs: breadcrumbsReducer,
  language: languageReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
