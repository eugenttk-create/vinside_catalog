import { isRejectedWithValue } from "@reduxjs/toolkit";
import { addNotification } from "../notifications/notificationsSlice";
import type { Middleware } from "@reduxjs/toolkit";

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message =
      typeof action.payload === "string" ? action.payload : "Произошла ошибка";

    store.dispatch(addNotification({ message, type: "error" }));
  }

  return next(action);
};
