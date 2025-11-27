import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./groups.types";
import { fetchGroups } from "./groupsThunks";

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addSelectedGroup: (state, action) => {
      state.selectedGroups.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      //get groups
      .addCase(fetchGroups.pending, (state) => {
        (state.groupsLoading = true), (state.groupsError = null);
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = null;
        state.groups = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });
  },
});

export const { addSelectedGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
