import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>,
    ) => {
      state.notifications.push({
        ...action.payload,
        id: crypto.randomUUID(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
