import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./groups.types";
import { fetchGroups, fetchByVin } from "./groupsThunks";
import type { GroupNode } from "./groups.types";

const insertChildren = (
  nodes: GroupNode[],
  parentId: string,
  children: GroupNode[]
) => {
  for (let node of nodes) {
    if (node.id === parentId) {
      node.children = children;
      return true;
    }
    if (node.children) {
      const inserted = insertChildren(node.children, parentId, children);
      if (inserted) return true;
    }
  }
  return false;
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    resetGroups: (state) => {
      state.groupsTree = [];
      state.groupsFlat = [];
      state.selectedGroups = [];
    },
  },

  extraReducers: (builder) => {
    //get groups
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })

      .addCase(fetchGroups.fulfilled, (state, action) => {
        const { parentId, children, flat } = action.payload;

        state.groupsLoading = false;
        state.groupsError = null;

        state.groupsFlat = flat;

        if (!parentId) {
          state.groupsTree = children;
          return;
        }

        insertChildren(state.groupsTree, parentId, children);
      })

      .addCase(fetchGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      })
      //get groups by vin
      .addCase(fetchByVin.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })

      .addCase(fetchByVin.fulfilled, (state) => {
        state.groupsLoading = false;
        state.groupsError = null;
      })

      .addCase(fetchByVin.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload as string;
      });
  },
});

export const { resetGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
